const Auth = {
  login(username, password, adminData) {
    const account = adminData.find(u => u.username === username && u.password === password);
    if (account) {
      localStorage.setItem("admin_session", JSON.stringify({ token: "SIGNED_IN", user: username, id: account.id_admin }));
      return true;
    }
    return false;
  },
  
  logout() {
    localStorage.removeItem("admin_session");
    window.location.href = "../login.html";
  },
  
  checkAuth() {
    const session = localStorage.getItem("admin_session");
    if (!session) {
      window.location.href = "../login.html";
    }
  }
};