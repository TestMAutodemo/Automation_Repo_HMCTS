export function validateBookingData(data: Record<string, string>) {
  const nameRegex = /^[A-Za-z]{3,}$/;
  const phoneRegex = /^\d{11,21}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Validate First Name
  if (!nameRegex.test(data.firstname) || data.firstname.length > 18) {
    throw new Error(`❌ Invalid first name: ${data.firstname}`);
  }

  // Validate Last Name
  if (!nameRegex.test(data.lastname) || data.lastname.length > 30) {
    throw new Error(`❌ Invalid last name: ${data.lastname}`);
  }

  // Validate Email
  if (!emailRegex.test(data.email)) {
    throw new Error(`❌ Invalid email: ${data.email}`);
  }

  // Validate Phone
  if (!phoneRegex.test(data.phone)) {
    throw new Error(`❌ Invalid phone number: ${data.phone}`);
  }

  // Validate Date Format
  if (!dateRegex.test(data.checkin)) {
    throw new Error(`❌ Check-in date must be in yyyy-mm-dd format: ${data.checkin}`);
  }
  if (!dateRegex.test(data.checkout)) {
    throw new Error(`❌ Check-out date must be in yyyy-mm-dd format: ${data.checkout}`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight

  const checkinDate = new Date(data.checkin);
  const checkoutDate = new Date(data.checkout);

  if (checkinDate < today) {
    throw new Error(`❌ Check-in date cannot be in the past: ${data.checkin}`);
  }

  if (checkoutDate <= checkinDate) {
    throw new Error(`❌ Check-out date must be after check-in: ${data.checkout}`);
  }
}