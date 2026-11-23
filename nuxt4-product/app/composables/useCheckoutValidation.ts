export const useCheckoutValidation = () => {
  const checkoutError = ref("");
  const customer = reactive({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
  });

  const checkoutErrors = reactive({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });

  function clearCheckoutErrors() {
    Object.keys(checkoutErrors).forEach((key) => {
      checkoutErrors[key as keyof typeof checkoutErrors] = "";
    });
  }

  // VALIDATION
  function validateCheckout(): boolean {
    clearCheckoutErrors();

    let valid = true;

    if (!customer.name.trim()) {
      checkoutErrors.name = "Full name is required.";
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      checkoutErrors.email = "Enter a valid email address.";
      valid = false;
    }

    if (!customer.phone.trim() || customer.phone.trim().length < 7) {
      checkoutErrors.phone = "Enter a valid phone number.";
      valid = false;
    }

    if (!customer.address.trim()) {
      checkoutErrors.address = "Shipping address is required.";
      valid = false;
    }

    if (!["COD", "GCash"].includes(customer.paymentMethod)) {
      checkoutErrors.paymentMethod = "Select a payment method.";
      valid = false;
    }

    return valid;
  }

  function resetCustomer(){
    customer.name = "";
    customer.email = "";
    customer.phone = "";
    customer.address = "";
    customer.paymentMethod = "COD";
    clearCheckoutErrors();
  }
  return {
    checkoutError,
    customer,
    checkoutErrors,
    clearCheckoutErrors,
    validateCheckout,
    resetCustomer
  }
};
