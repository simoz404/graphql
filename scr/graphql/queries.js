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
                }`
}
