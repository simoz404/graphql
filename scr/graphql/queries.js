export const queries = {
    CombinedUserData: `{
        user {
          firstName
          lastName
          auditRatio
          totalDown
          totalUp
        }
        xpProgress: transaction(
          where: {
            _and: [
              { type: { _eq: "xp" } }
              { eventId: { _eq: 41 } }
            ]
          }
        ) {
          type
          amount
          path
          createdAt
          eventId
          object {
            type
            name
          }
        }
        checkpoint01: transaction(
          where: {
            _and: [
              { type: { _eq: "xp" } }
              { eventId: { _eq: 11 } }
              { path: { _like: "%checkpoint-01%" } }
            ]
          }
        ) {
          path
        }
        checkpoint02: transaction(
          where: {
            _and: [
              { type: { _eq: "xp" } }
              { eventId: { _eq: 11 } }
              { path: { _like: "%checkpoint-02%" } }
            ]
          }
        ) {
          path
        }
        checkpoint03: transaction(
          where: {
            _and: [
              { type: { _eq: "xp" } }
              { eventId: { _eq: 11 } }
              { path: { _like: "%checkpoint-03%" } }
            ]
          }
        ) {
          path
        }
        finalCheckpoint: transaction(
          where: {
            _and: [
              { type: { _eq: "xp" } }
              { eventId: { _eq: 11 } }
              { path: { _like: "%final-checkpoint%" } }
            ]
          }
        ) {
          path
        }
      }`
}
