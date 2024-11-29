import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolePermissionModule } from "./RolePermissionModule";

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(
    () => RolePermissionModule,
    (rolePermissionModule) => rolePermissionModule.module,
    {onDelete : 'CASCADE',eager : true}
  )
  rolePermissionsModules: RolePermissionModule[];
}
