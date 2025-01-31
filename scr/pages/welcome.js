export async function createWelcome(user) {
    const { firstName, lastName } = user[0];
        const h1 = document.createElement('h1')
        h1.className = 'welcome'
        h1.textContent = `Welcome, ${firstName} ${lastName}!`
        document.body.appendChild(h1)
}