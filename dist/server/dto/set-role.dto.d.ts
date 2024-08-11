import { RoleType } from "@prisma/client";
export declare class SetRoleDto {
    serverId: string;
    memberId: string;
    role: RoleType;
}
