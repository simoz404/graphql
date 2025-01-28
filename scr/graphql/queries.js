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
                        transaction {
                            user {
                                auditRatio
                            }
                        }

                    }`
}