export const queries = {
    name : `{
                user {
                    firstName
                    lastName
                }
            }`,
    totalXp : `{
                    transaction {
                        type
                        amount
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
