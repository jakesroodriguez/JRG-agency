"""
Generador de Rascacielos Arquitectonicos de Dubai en Blender 5.2
Crea modelos 3D con geometria detallada, antenas, celosias, coronas iluminadas y exporta dubai_cityscape.glb
"""
import bpy
import bmesh
import math
import random
import os

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_pbr_material(name, base_color, roughness=0.2, metallic=0.8, emissive_color=(0, 0, 0, 1), emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = base_color
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
        if emission_strength > 0:
            if "Emission Color" in bsdf.inputs:
                bsdf.inputs["Emission Color"].default_value = emissive_color
                bsdf.inputs["Emission Strength"].default_value = emission_strength
            elif "Emission" in bsdf.inputs:
                bsdf.inputs["Emission"].default_value = emissive_color
    return mat

def create_helix_tower(name, loc, height=75, radius=7, twists=0.8):
    """Torre helicoidal con pisos torsionados y aristas iluminadas"""
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = loc

    bm = bmesh.new()
    num_floors = 32
    floor_height = height / num_floors
    segments = 6

    verts_prev = []
    for f in range(num_floors + 1):
        z = f * floor_height
        angle_offset = (f / num_floors) * twists * math.pi
        r = radius * (1.0 - 0.25 * (f / num_floors))
        verts_current = []
        for s in range(segments):
            a = angle_offset + (s / segments) * 2 * math.pi
            x = math.cos(a) * r
            y = math.sin(a) * r
            v = bm.verts.new((x, y, z))
            verts_current.append(v)
        
        if verts_prev:
            for s in range(segments):
                s_next = (s + 1) % segments
                v1 = verts_prev[s]
                v2 = verts_prev[s_next]
                v3 = verts_current[s_next]
                v4 = verts_current[s]
                bm.faces.new((v1, v2, v3, v4))
        verts_prev = verts_current

    bm.to_mesh(mesh)
    bm.free()
    
    # Aguja en la cima
    spire_mesh = bpy.data.meshes.new(name + "_spire_mesh")
    spire_obj = bpy.data.objects.new(name + "_spire", spire_mesh)
    bpy.context.collection.objects.link(spire_obj)
    spire_obj.location = (loc[0], loc[1], loc[2] + height)
    bm_spire = bmesh.new()
    bmesh.ops.create_cone(bm_spire, cap_ends=True, cap_tris=False, segments=8, radius1=0.8, radius2=0.05, depth=14)
    bm_spire.to_mesh(spire_mesh)
    bm_spire.free()
    spire_obj.location.z += 7

    return [obj, spire_obj]

def create_stepped_skyscraper(name, loc, base_w=14, base_d=12, total_h=95):
    """Rascacielos escalonado clasico de lujo con retranqueos y balcones"""
    parent_obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(parent_obj)
    parent_obj.location = loc

    tiers = [
        {"w": base_w, "d": base_d, "h": total_h * 0.45, "z": 0},
        {"w": base_w * 0.78, "d": base_d * 0.78, "h": total_h * 0.30, "z": total_h * 0.45},
        {"w": base_w * 0.55, "d": base_d * 0.55, "h": total_h * 0.18, "z": total_h * 0.75},
        {"w": base_w * 0.32, "d": base_d * 0.32, "h": total_h * 0.07, "z": total_h * 0.93},
    ]

    objects = [parent_obj]
    for i, tier in enumerate(tiers):
        mesh = bpy.data.meshes.new(f"{name}_tier_{i}")
        o = bpy.data.objects.new(f"{name}_tier_{i}", mesh)
        bpy.context.collection.objects.link(o)
        o.parent = parent_obj
        o.location = (0, 0, tier["z"] + tier["h"] / 2)
        
        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=1.0)
        # Escalar al tamano deseado
        bmesh.ops.scale(bm, vec=(tier["w"], tier["d"], tier["h"]), verts=bm.verts)
        bm.to_mesh(mesh)
        bm.free()
        objects.append(o)

    # Corona con aguja
    spire_mesh = bpy.data.meshes.new(f"{name}_spire")
    spire = bpy.data.objects.new(f"{name}_spire", spire_mesh)
    bpy.context.collection.objects.link(spire)
    spire.parent = parent_obj
    spire.location = (0, 0, total_h + 10)
    bm_s = bmesh.new()
    bmesh.ops.create_cone(bm_s, cap_ends=True, cap_tris=False, segments=8, radius1=0.6, radius2=0.04, depth=20)
    bm_s.to_mesh(spire_mesh)
    bm_s.free()
    objects.append(spire)

    return objects

def create_twin_towers(name, loc, width=9, depth=9, height=110, gap=8):
    """Torres gemelas con puente elevado de cristal (Skybridge)"""
    group = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(group)
    group.location = loc
    objs = [group]

    for side, x_offset in [("left", -gap / 2 - width / 2), ("right", gap / 2 + width / 2)]:
        mesh = bpy.data.meshes.new(f"{name}_{side}")
        t = bpy.data.objects.new(f"{name}_{side}", mesh)
        bpy.context.collection.objects.link(t)
        t.parent = group
        t.location = (x_offset, 0, height / 2)

        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=1.0)
        bmesh.ops.scale(bm, vec=(width, depth, height), verts=bm.verts)
        bm.to_mesh(mesh)
        bm.free()
        objs.append(t)

    # Skybridge de cristal en el piso 60%
    bridge_mesh = bpy.data.meshes.new(f"{name}_bridge")
    bridge = bpy.data.objects.new(f"{name}_bridge", bridge_mesh)
    bpy.context.collection.objects.link(bridge)
    bridge.parent = group
    bridge.location = (0, 0, height * 0.65)
    bm_b = bmesh.new()
    bmesh.ops.create_cube(bm_b, size=1.0)
    bmesh.ops.scale(bm_b, vec=(gap + 1.0, depth * 0.7, 4.5), verts=bm_b.verts)
    bm_b.to_mesh(bridge_mesh)
    bm_b.free()
    objs.append(bridge)

    return objs

def create_sail_tower(name, loc, height=85, width=16, depth=14):
    """Silueta en forma de vela curvada futurista (estilo Burj Al Arab)"""
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = loc

    bm = bmesh.new()
    steps = 24
    dz = height / steps
    
    verts_profile_left = []
    verts_profile_right = []
    
    for i in range(steps + 1):
        z = i * dz
        t = i / steps
        # Curva parabolica en el lado frontal
        curve_front = math.sin(t * math.pi * 0.95) * (depth * 0.65)
        w = width * (1.0 - 0.5 * t)
        
        v_bl = bm.verts.new((-w/2, -depth/2, z))
        v_br = bm.verts.new((w/2, -depth/2, z))
        v_fl = bm.verts.new((-w/2 * 0.85, curve_front, z))
        v_fr = bm.verts.new((w/2 * 0.85, curve_front, z))
        
        if i > 0:
            # Conectar caras
            p_bl, p_br, p_fl, p_fr = prev_row
            # Cara trasera
            bm.faces.new((p_bl, p_br, v_br, v_bl))
            # Cara frontal curvada
            bm.faces.new((p_fl, v_fl, v_fr, p_fr))
            # Lados izquierdo y derecho
            bm.faces.new((p_bl, v_bl, v_fl, p_fl))
            bm.faces.new((p_br, p_fr, v_fr, v_br))
            
        prev_row = (v_bl, v_br, v_fl, v_fr)

    bm.to_mesh(mesh)
    bm.free()
    return [obj]

def build_dubai_cityscape(output_path):
    reset_scene()
    
    # Crear Materiales PBR
    mat_dark_glass = create_pbr_material("DarkGlass", (0.05, 0.06, 0.09, 1.0), roughness=0.08, metallic=0.92)
    mat_gold_glass = create_pbr_material("GoldGlass", (0.22, 0.18, 0.08, 1.0), roughness=0.12, metallic=0.88)
    mat_titanium = create_pbr_material("TitaniumStructure", (0.12, 0.13, 0.16, 1.0), roughness=0.35, metallic=0.8)
    mat_illuminated_windows = create_pbr_material("WindowsGlow", (0.1, 0.1, 0.12, 1.0), roughness=0.2, metallic=0.5, emissive_color=(1.0, 0.88, 0.65, 1.0), emission_strength=1.8)
    mat_cyan_glow = create_pbr_material("CyanCrownGlow", (0.05, 0.1, 0.12, 1.0), roughness=0.1, metallic=0.5, emissive_color=(0.2, 0.85, 1.0, 1.0), emission_strength=3.2)
    mat_red_beacon = create_pbr_material("RedBeacon", (0.1, 0.0, 0.0, 1.0), roughness=0.1, metallic=0.1, emissive_color=(1.0, 0.1, 0.1, 1.0), emission_strength=5.0)

    all_objects = []

    # 1. Torre Burj Khalifa / Mega Spire en el horizonte Este
    t_spire = create_stepped_skyscraper("Burj_Horizon", (28, -75, -20), base_w=20, base_d=20, total_h=150)
    all_objects.extend(t_spire)

    # 2. Torres Gemelas con Skybridge
    t_twins = create_twin_towers("Twin_Emirates", (-42, -65, -20), width=10, depth=10, height=125, gap=11)
    all_objects.extend(t_twins)

    # 3. Torre Helicoidal (Cayan Style) en primer plano Norte
    t_helix = create_helix_tower("Cayan_Helix", (-18, -48, -18), height=95, radius=7.5, twists=0.85)
    all_objects.extend(t_helix)

    # 4. Torre Vela Curvada en el Oeste
    t_sail = create_sail_tower("Burj_Sail", (46, -38, -18), height=88, width=16, depth=15)
    all_objects.extend(t_sail)

    # 5. Segunda Torre Helicoidal estilizada
    t_helix2 = create_helix_tower("Twisted_Tower_2", (16, -55, -20), height=85, radius=6.5, twists=-0.7)
    all_objects.extend(t_helix2)

    # 6. Rascacielos Perimetrales de Fondo (Anillo de 18 Torres con alturas variadas de 60m a 115m)
    random.seed(42)
    for i in range(18):
        angle = -math.pi * 0.95 + (i / 18.0) * math.pi * 1.9
        dist = 65 + (i % 4) * 16 + random.uniform(-4, 6)
        x = math.sin(angle) * dist
        y = -math.cos(angle) * dist - 8
        h = 55 + (i % 5) * 15 + random.uniform(5, 25)
        w = 8 + (i % 3) * 3
        d = 8 + ((i + 1) % 3) * 3
        
        t_bg = create_stepped_skyscraper(f"Skyline_Tower_{i}", (x, y, -22), base_w=w, base_d=d, total_h=h)
        all_objects.extend(t_bg)

    # Asignar Materiales a todos los objetos creados
    for idx, obj in enumerate(all_objects):
        if obj.type == 'MESH':
            # Asignar materiales variados
            if "spire" in obj.name.lower():
                obj.data.materials.append(mat_red_beacon)
            elif "bridge" in obj.name.lower() or "crown" in obj.name.lower():
                obj.data.materials.append(mat_cyan_glow)
            elif idx % 4 == 0:
                obj.data.materials.append(mat_gold_glass)
            elif idx % 3 == 0:
                obj.data.materials.append(mat_illuminated_windows)
            elif idx % 2 == 0:
                obj.data.materials.append(mat_dark_glass)
            else:
                obj.data.materials.append(mat_titanium)

    # Exportar GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_materials='EXPORT',
        export_yup=True
    )
    print(f"EXPORT COMPLETADO: {output_path} ({len(all_objects)} torres creadas)")

if __name__ == "__main__":
    out = os.path.abspath("1-Web/01_💻_Codigo_Web/public/models/dubai_cityscape.glb")
    build_dubai_cityscape(out)
