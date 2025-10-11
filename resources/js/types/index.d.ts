export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    data?: Array;
    current_page?: number;
    total?: number;
    per_page?: number;
};
