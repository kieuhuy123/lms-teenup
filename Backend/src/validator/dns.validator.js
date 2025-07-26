import { BadRequestError } from "../core/error.response.js";

const validateDNSRecord = (record) => {
  // Required fields
  if (!record.host || !record.type || !record.answer) {
    throw new BadRequestError("Missing required DNS record fields");
  }

  // Validate record type
  const validTypes = ["A", "AAAA", "CNAME", "MX", "TXT", "SRV", "CAA"];
  if (!validTypes.includes(record.type)) {
    throw new BadRequestError("Invalid DNS record type");
  }

  // Type-specific validation
  switch (record.type) {
    case "A":
      validateIPv4(record.answer);
      break;
    case "AAAA":
      validateIPv6(record.answer);
      break;
    case "MX":
      if (!record.priority) {
        throw new BadRequestError("MX record requires priority field");
      }
      break;
    // Add other type-specific validations
  }
};

// Helper validation functions
const validateIPv4 = (ip) => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) {
    throw new BadRequestError("Invalid IPv4 address");
  }
};

const validateIPv6 = (ip) => {
  const ipv6Regex = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
  if (!ipv6Regex.test(ip)) {
    throw new BadRequestError("Invalid IPv6 address");
  }
};

export { validateDNSRecord, validateIPv4, validateIPv6 };
