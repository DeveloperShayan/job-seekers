import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";
import { Permission } from "./Permission";
import { Module } from "./Module";

@Entity('role_permissions_modules')
export class RolePermissionModule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.rolePermissionsModules,{onDelete : 'CASCADE'})
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissionsModules,{onDelete : 'CASCADE'})
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @Column({default : false})
  status : boolean;

  @ManyToOne(() => Module, (module) => module.rolePermissionsModules,{onDelete : 'CASCADE'})
  @JoinColumn({ name: 'module_id' })
  module: Module;
}
