import { UserProps } from "./user";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: UserProps | null;
    };
    data?: Array<any>;
    current_page?: number;
    total?: number;
    per_page?: number;
};
