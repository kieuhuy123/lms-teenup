const validateMessage = (content) => {
  if (!content) {
    return "Message content is required";
  }
  if (typeof content !== "string") {
    return "Message content must be a string";
  }
  if (content.length < 1) {
    return "Message content cannot be empty";
  }
  if (content.length > 4000) {
    return "Message content is too long (max 4000 characters)";
  }
  return null;
};

export { validateMessage };
