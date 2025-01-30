export const queries = {
    name : `{
                user {
                    firstName
                    lastName
                }
            }`,
    xpProgress : `{
                    transaction(where : { _and : [{type : {_eq : "xp"}},
                    {eventId : {_eq : 41}}
                    ]}) {  
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
                }`,
    auditRatio : `{
                        user {
                            auditRatio
                            totalDown
                            totalUp
                        }
                }`,
    goCheckpoint : `{
  checkpoint01: transaction(
    where: {
      _and: [{ type: { _eq: "xp" } }, { eventId: { _eq: 11 } }, { path: { _like: "%checkpoint-01%" } }]
    }
  ) {
    path
  }
  
  checkpoint02: transaction(
    where: {
      _and: [{ type: { _eq: "xp" } }, { eventId: { _eq: 11 } }, { path: { _like: "%checkpoint-02%" } }]
    }
  ) {
    path
  }

  checkpoint03: transaction(
    where: {
      _and: [{ type: { _eq: "xp" } }, { eventId: { _eq: 11 } }, { path: { _like: "%checkpoint-03%" } }]
    }
  ) {
    path
  }

  finalCheckpoint: transaction(
    where: {
      _and: [{ type: { _eq: "xp" } }, { eventId: { _eq: 11 } }, { path: { _like: "%final-checkpoint%" } }]
    }
  ) {
    path
  }
}
`
}
