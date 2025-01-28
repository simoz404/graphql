export function addLogoutButton() {
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'btn logout-btn';
    logoutBtn.onclick = () => {
        localStorage.removeItem('jwt');
        location.reload();
    };
    document.body.appendChild(logoutBtn);
}