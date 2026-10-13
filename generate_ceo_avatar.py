"""
Generador de Avatar 3D del CEO en Blender 5.2
Crea un personaje humanoide estilizado ejecutivo (traje sastre negro/grafito, camisa blanca, zapatos oxford),
con armadura riggeada y clips de animacion 'Idle' y 'Walk' para control en tercera persona.
"""
import bpy
import bmesh
import math
import os

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_pbr_material(name, base_color, roughness=0.3, metallic=0.1):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = base_color
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
    return mat

def create_ceo_mesh(armature_obj):
    # Materiales ejecutivos convencionales de calidad
    mat_suit = create_pbr_material("Suit_Charcoal", (0.08, 0.085, 0.11, 1.0), roughness=0.65, metallic=0.15)
    mat_shirt = create_pbr_material("Shirt_White", (0.92, 0.93, 0.95, 1.0), roughness=0.5, metallic=0.0)
    mat_shoes = create_pbr_material("Shoes_Leather", (0.04, 0.04, 0.05, 1.0), roughness=0.25, metallic=0.3)
    mat_skin = create_pbr_material("Skin_Tone", (0.82, 0.64, 0.52, 1.0), roughness=0.55, metallic=0.0)
    mat_hair = create_pbr_material("Hair_Dark", (0.07, 0.06, 0.06, 1.0), roughness=0.8, metallic=0.0)
    mat_gold_watch = create_pbr_material("Gold_Watch", (0.9, 0.75, 0.25, 1.0), roughness=0.2, metallic=0.9)

    parts = []

    # 1. Torso / Traje Ejecutivo
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.15))
    torso = bpy.context.active_object
    torso.name = "Torso"
    torso.scale = (0.42, 0.24, 0.48)
    bpy.ops.object.transform_apply(scale=True)
    torso.data.materials.append(mat_suit)
    parts.append((torso, "Spine"))

    # Cuello / Camisa
    bpy.ops.mesh.primitive_cylinder_add(radius=0.10, depth=0.12, location=(0, 0, 1.44))
    neck = bpy.context.active_object
    neck.name = "Neck"
    neck.data.materials.append(mat_shirt)
    parts.append((neck, "Neck"))

    # Cabeza estilizada
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.16, location=(0, 0, 1.62))
    head = bpy.context.active_object
    head.name = "Head"
    head.scale = (0.95, 1.05, 1.1)
    bpy.ops.object.transform_apply(scale=True)
    head.data.materials.append(mat_skin)
    parts.append((head, "Head"))

    # Cabello ejecutivo moderno
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.17, location=(0, -0.02, 1.67))
    hair = bpy.context.active_object
    hair.name = "Hair"
    hair.scale = (0.98, 1.02, 0.8)
    bpy.ops.object.transform_apply(scale=True)
    hair.data.materials.append(mat_hair)
    parts.append((hair, "Head"))

    # Brazos y Manos
    for side, x_sign, bone_arm, bone_forearm, bone_hand in [("L", 1, "Arm.L", "Forearm.L", "Hand.L"), ("R", -1, "Arm.R", "Forearm.R", "Hand.R")]:
        # Brazo superior
        bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.32, location=(x_sign * 0.28, 0, 1.22))
        arm = bpy.context.active_object
        arm.name = f"Arm_{side}"
        arm.data.materials.append(mat_suit)
        parts.append((arm, bone_arm))

        # Antebrazo
        bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=0.30, location=(x_sign * 0.28, 0, 0.92))
        forearm = bpy.context.active_object
        forearm.name = f"Forearm_{side}"
        forearm.data.materials.append(mat_suit)
        parts.append((forearm, bone_forearm))

        # Reloj dorado en la mano izquierda
        if side == "L":
            bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.04, location=(0.28, 0, 0.76))
            watch = bpy.context.active_object
            watch.name = "Watch"
            watch.data.materials.append(mat_gold_watch)
            parts.append((watch, bone_forearm))

        # Mano
        bpy.ops.mesh.primitive_cube_add(size=0.10, location=(x_sign * 0.28, 0, 0.72))
        hand = bpy.context.active_object
        hand.name = f"Hand_{side}"
        hand.scale = (0.6, 1.0, 1.1)
        bpy.ops.object.transform_apply(scale=True)
        hand.data.materials.append(mat_skin)
        parts.append((hand, bone_hand))

    # Piernas y Zapatos
    for side, x_sign, bone_thigh, bone_shin, bone_foot in [("L", 1, "Thigh.L", "Shin.L", "Foot.L"), ("R", -1, "Thigh.R", "Shin.R", "Foot.R")]:
        # Muslo con pantalon de vestir
        bpy.ops.mesh.primitive_cylinder_add(radius=0.095, depth=0.42, location=(x_sign * 0.13, 0, 0.70))
        thigh = bpy.context.active_object
        thigh.name = f"Thigh_{side}"
        thigh.data.materials.append(mat_suit)
        parts.append((thigh, bone_thigh))

        # Espinilla
        bpy.ops.mesh.primitive_cylinder_add(radius=0.085, depth=0.40, location=(x_sign * 0.13, 0, 0.30))
        shin = bpy.context.active_object
        shin.name = f"Shin_{side}"
        shin.data.materials.append(mat_suit)
        parts.append((shin, bone_shin))

        # Zapato de cuero oxford
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_sign * 0.13, 0.04, 0.05))
        foot = bpy.context.active_object
        foot.name = f"Foot_{side}"
        foot.scale = (0.11, 0.26, 0.08)
        bpy.ops.object.transform_apply(scale=True)
        foot.data.materials.append(mat_shoes)
        parts.append((foot, bone_foot))

    # Unir todas las partes en un solo mesh manteniendo materiales y grupos de vertices para el rig
    bpy.ops.object.select_all(action='DESELECT')
    for p, _ in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0][0]
    bpy.ops.object.join()
    
    combined_mesh = bpy.context.active_object
    combined_mesh.name = "CEO_Mesh"

    # Crear Vertex Groups correspondientes a los huesos
    for p_obj_dummy, bone_name in parts:
        if bone_name not in combined_mesh.vertex_groups:
            combined_mesh.vertex_groups.new(name=bone_name)

    # Emparentar a la armadura con pesos automaticos
    combined_mesh.parent = armature_obj
    mod = combined_mesh.modifiers.new(name="ArmatureModifier", type='ARMATURE')
    mod.object = armature_obj

    # Asignar pesos aproximados por proximidad de altura Z
    for v in combined_mesh.data.vertices:
        z = v.co.z
        x = v.co.x
        if z > 1.48:
            vg = combined_mesh.vertex_groups.get("Head")
            if vg: vg.add([v.index], 1.0, 'REPLACE')
        elif z > 1.38:
            vg = combined_mesh.vertex_groups.get("Neck")
            if vg: vg.add([v.index], 1.0, 'REPLACE')
        elif z > 0.92:
            if abs(x) > 0.20:
                side = "L" if x > 0 else "R"
                vg = combined_mesh.vertex_groups.get(f"Arm.{side}")
                if vg: vg.add([v.index], 1.0, 'REPLACE')
            else:
                vg = combined_mesh.vertex_groups.get("Spine")
                if vg: vg.add([v.index], 1.0, 'REPLACE')
        elif z > 0.65:
            if abs(x) > 0.20:
                side = "L" if x > 0 else "R"
                vg = combined_mesh.vertex_groups.get(f"Forearm.{side}")
                if vg: vg.add([v.index], 1.0, 'REPLACE')
            else:
                side = "L" if x > 0 else "R"
                vg = combined_mesh.vertex_groups.get(f"Thigh.{side}")
                if vg: vg.add([v.index], 1.0, 'REPLACE')
        elif z > 0.15:
            side = "L" if x > 0 else "R"
            vg = combined_mesh.vertex_groups.get(f"Shin.{side}")
            if vg: vg.add([v.index], 1.0, 'REPLACE')
        else:
            side = "L" if x > 0 else "R"
            vg = combined_mesh.vertex_groups.get(f"Foot.{side}")
            if vg: vg.add([v.index], 1.0, 'REPLACE')

    return combined_mesh

def create_ceo_armature():
    bpy.ops.object.armature_add(enter_editmode=True, align='WORLD', location=(0, 0, 0))
    armature_obj = bpy.context.active_object
    armature_obj.name = "CEO_Armature"
    arm_data = armature_obj.data
    arm_data.name = "CEO_Armature_Data"

    # Limpiar hueso inicial
    for b in arm_data.edit_bones:
        arm_data.edit_bones.remove(b)

    # Crear huesos
    root = arm_data.edit_bones.new("Root")
    root.head = (0, 0, 0)
    root.tail = (0, 0, 0.2)

    spine = arm_data.edit_bones.new("Spine")
    spine.head = (0, 0, 0.9)
    spine.tail = (0, 0, 1.4)
    spine.parent = root

    neck = arm_data.edit_bones.new("Neck")
    neck.head = (0, 0, 1.4)
    neck.tail = (0, 0, 1.5)
    neck.parent = spine

    head = arm_data.edit_bones.new("Head")
    head.head = (0, 0, 1.5)
    head.tail = (0, 0, 1.75)
    head.parent = neck

    for side, x in [("L", 1), ("R", -1)]:
        arm = arm_data.edit_bones.new(f"Arm.{side}")
        arm.head = (x * 0.25, 0, 1.38)
        arm.tail = (x * 0.28, 0, 1.08)
        arm.parent = spine

        forearm = arm_data.edit_bones.new(f"Forearm.{side}")
        forearm.head = (x * 0.28, 0, 1.08)
        forearm.tail = (x * 0.28, 0, 0.78)
        forearm.parent = arm

        hand = arm_data.edit_bones.new(f"Hand.{side}")
        hand.head = (x * 0.28, 0, 0.78)
        hand.tail = (x * 0.28, 0, 0.68)
        hand.parent = forearm

        thigh = arm_data.edit_bones.new(f"Thigh.{side}")
        thigh.head = (x * 0.13, 0, 0.9)
        thigh.tail = (x * 0.13, 0, 0.48)
        thigh.parent = root

        shin = arm_data.edit_bones.new(f"Shin.{side}")
        shin.head = (x * 0.13, 0, 0.48)
        shin.tail = (x * 0.13, 0, 0.10)
        shin.parent = thigh

        foot = arm_data.edit_bones.new(f"Foot.{side}")
        foot.head = (x * 0.13, 0, 0.10)
        foot.tail = (x * 0.13, 0.14, 0.0)
        foot.parent = shin

    bpy.ops.object.mode_set(mode='OBJECT')
    return armature_obj

def add_animations(armature_obj):
    bpy.context.view_layer.objects.active = armature_obj
    bpy.ops.object.mode_set(mode='POSE')
    
    # 1. Animacion IDLE
    action_idle = bpy.data.actions.new(name="Idle")
    armature_obj.animation_data_create()
    armature_obj.animation_data.action = action_idle
    
    # Keyframe 1 (Frame 1)
    for pbone in armature_obj.pose.bones:
        pbone.rotation_mode = 'XYZ'
        pbone.rotation_euler = (0, 0, 0)
        pbone.keyframe_insert(data_path="rotation_euler", frame=1)
    
    # Keyframe 2 (Frame 30): Suave respiracion
    spine = armature_obj.pose.bones.get("Spine")
    if spine:
        spine.rotation_euler = (math.radians(1.5), 0, 0)
        spine.keyframe_insert(data_path="rotation_euler", frame=30)
    
    # Keyframe 3 (Frame 60): Retorno
    if spine:
        spine.rotation_euler = (0, 0, 0)
        spine.keyframe_insert(data_path="rotation_euler", frame=60)
        
    action_idle.use_fake_user = True

    # 2. Animacion WALK (Ciclo de caminata de 30 frames a 30fps = 1 segundo de paso continuo)
    action_walk = bpy.data.actions.new(name="Walk")
    armature_obj.animation_data.action = action_walk

    thigh_l = armature_obj.pose.bones.get("Thigh.L")
    thigh_r = armature_obj.pose.bones.get("Thigh.R")
    shin_l = armature_obj.pose.bones.get("Shin.L")
    shin_r = armature_obj.pose.bones.get("Shin.R")
    arm_l = armature_obj.pose.bones.get("Arm.L")
    arm_r = armature_obj.pose.bones.get("Arm.R")

    # Frame 1: Pierna L adelante (+25°), Pierna R atras (-25°), Brazos opuestos
    if thigh_l: thigh_l.rotation_euler = (math.radians(24), 0, 0); thigh_l.keyframe_insert("rotation_euler", frame=1)
    if thigh_r: thigh_r.rotation_euler = (math.radians(-24), 0, 0); thigh_r.keyframe_insert("rotation_euler", frame=1)
    if shin_l: shin_l.rotation_euler = (math.radians(5), 0, 0); shin_l.keyframe_insert("rotation_euler", frame=1)
    if shin_r: shin_r.rotation_euler = (math.radians(-20), 0, 0); shin_r.keyframe_insert("rotation_euler", frame=1)
    if arm_l: arm_l.rotation_euler = (math.radians(-20), 0, 0); arm_l.keyframe_insert("rotation_euler", frame=1)
    if arm_r: arm_r.rotation_euler = (math.radians(20), 0, 0); arm_r.keyframe_insert("rotation_euler", frame=1)

    # Frame 15: Paso cruzado invertido
    if thigh_l: thigh_l.rotation_euler = (math.radians(-24), 0, 0); thigh_l.keyframe_insert("rotation_euler", frame=15)
    if thigh_r: thigh_r.rotation_euler = (math.radians(24), 0, 0); thigh_r.keyframe_insert("rotation_euler", frame=15)
    if shin_l: shin_l.rotation_euler = (math.radians(-20), 0, 0); shin_l.keyframe_insert("rotation_euler", frame=15)
    if shin_r: shin_r.rotation_euler = (math.radians(5), 0, 0); shin_r.keyframe_insert("rotation_euler", frame=15)
    if arm_l: arm_l.rotation_euler = (math.radians(20), 0, 0); arm_l.keyframe_insert("rotation_euler", frame=15)
    if arm_r: arm_r.rotation_euler = (math.radians(-20), 0, 0); arm_r.keyframe_insert("rotation_euler", frame=15)

    # Frame 30: Cierre de ciclo
    if thigh_l: thigh_l.rotation_euler = (math.radians(24), 0, 0); thigh_l.keyframe_insert("rotation_euler", frame=30)
    if thigh_r: thigh_r.rotation_euler = (math.radians(-24), 0, 0); thigh_r.keyframe_insert("rotation_euler", frame=30)
    if shin_l: shin_l.rotation_euler = (math.radians(5), 0, 0); shin_l.keyframe_insert("rotation_euler", frame=30)
    if shin_r: shin_r.rotation_euler = (math.radians(-20), 0, 0); shin_r.keyframe_insert("rotation_euler", frame=30)
    if arm_l: arm_l.rotation_euler = (math.radians(-20), 0, 0); arm_l.keyframe_insert("rotation_euler", frame=30)
    if arm_r: arm_r.rotation_euler = (math.radians(20), 0, 0); arm_r.keyframe_insert("rotation_euler", frame=30)

    action_walk.use_fake_user = True
    bpy.ops.object.mode_set(mode='OBJECT')

def build_ceo_avatar(output_path):
    reset_scene()
    armature = create_ceo_armature()
    mesh = create_ceo_mesh(armature)
    add_animations(armature)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_animations=True,
        export_yup=True
    )
    print(f"AVATAR CEO EXPORTADO CON EXITO: {output_path}")

if __name__ == "__main__":
    out = os.path.abspath("1-Web/01_💻_Codigo_Web/public/models/ceo_avatar.glb")
    build_ceo_avatar(out)
