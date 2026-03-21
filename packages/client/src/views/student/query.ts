import { graphql } from "@/api";

export const GET_MY_PROFILES = graphql(`
  query UserProfiles {
    user {
      id
      profiles {
        id
        email
        username
        firstName
        lastName
        phoneNumber
        deleted
        availabilitySlots {
          id
          dayOfWeek
          startTime
          duration
        }
        roleProfile {
          __typename
        }
      }
    }
  }
`)
