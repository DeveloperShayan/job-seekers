import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./UserRole";
import { RolePermissionModule } from "./RolePermissionModule";

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role ,{onDelete : 'CASCADE',eager : true})
  userRoles: UserRole[];

  @OneToMany(
    () => RolePermissionModule,
    (rolePermissionModule) => rolePermissionModule.role
    ,{onDelete : 'CASCADE',eager : true}
  )
  rolePermissionsModules: RolePermissionModule[];
}
