/**
 * Loads Google Identity Services once; reused by Login/Signup so only one script tag is injected.
 */
let loadPromise = null;

export function loadGoogleIdentityScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in requires a browser."));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      loadPromise = null;
      reject(new Error("Google Identity Services failed to initialize."));
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Google script."));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
