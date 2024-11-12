import { useCallback } from "react";

export const useUserRole = () => {
    const mapUserRole = useCallback((role) => {

        switch (role) {
            case "role_master":
                return 'Master';
            case "role_rrhh":
                return 'Recursos Humanos';
            case "role_budget":
                return 'Presupuesto';
            case "role_analyst":
                return 'Analista';
            default:
                return role;
        }
    }, []);
        return mapUserRole;
};


