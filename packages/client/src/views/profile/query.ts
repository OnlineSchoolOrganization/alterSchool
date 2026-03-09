import { graphql } from "@/api";

export const GET_MY_PROFILES = graphql(`
        query UserProfiles {
            user {
                id
                profiles {
                    id
                    email
                    username
                }
            }
        }
    `)