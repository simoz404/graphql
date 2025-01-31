export async function createWelcome(user) {
    const { firstName, lastName } = user[0];
        const h1 = document.querySelector(".welcome")
        h1.textContent = `Welcome, ${firstName} ${lastName}!`
}