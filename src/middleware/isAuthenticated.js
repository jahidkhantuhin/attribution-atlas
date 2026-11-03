export default function ({ redirect, store, $config }) {
  if ($config && $config.demoMode) {
    return
  }

  const isAuthenticated = store.getters['users/isAuthenticated'] ? true : false
    // If the user is not authenticated
    if (!isAuthenticated) {
      return redirect("/login");
    }
  }