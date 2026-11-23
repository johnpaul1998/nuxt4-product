
export const useNewsLetter = () => {
  // NEWSLETTER
  const newsletterEmail = ref<string>("");
  const emailRules = [
    (value: string) => !!value || "Email is required.",
    (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
      "Please enter a valid email address.",
  ];

  function subscribeNewsletter() {
    if (
      !newsletterEmail.value ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)
    ) {
      return `Please enter a valid email address.`;
    }
    newsletterEmail.value = "";
    return `Welcome to the Mikē community!`;
  }
  return{
    newsletterEmail,
    emailRules,
    subscribeNewsletter
  }
};
