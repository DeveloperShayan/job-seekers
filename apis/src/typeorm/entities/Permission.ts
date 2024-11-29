import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolePermissionModule } from "./RolePermissionModule";

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(
    () => RolePermissionModule,
    (rolePermissionModule) => rolePermissionModule.permission
    ,{onDelete : 'CASCADE',eager : true}
  )
  rolePermissionsModules: RolePermissionModule[];
}
