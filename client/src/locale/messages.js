import { defineMessages } from 'react-intl';
const messages = defineMessages({
  home: {
    id: 'app.home',
    defaultMessage: 'Home',
    description: 'Menu item',
  },
  becomeAHost: {
    id: 'app.becomeAHost',
    defaultMessage: 'Become an owner',
    description: 'Menu item',
  },
  idLabel: { id: "admin.payoutMegasoft.id", defaultMessage: "ID" },
methodLabel: { id: "admin.payoutMegasoft.method", defaultMessage: "Method" },
amountLabel: { id: "admin.payoutMegasoft.amount", defaultMessage: "Amount" },
listingTitleLabel: { id: "admin.payoutMegasoft.listingTitle", defaultMessage: "Listing Title" },
ownerNameLabel: { id: "admin.payoutMegasoft.ownerName", defaultMessage: "Owner Name" },
ownerEmailLabel: { id: "admin.payoutMegasoft.ownerEmail", defaultMessage: "Owner Email" },
transferStatusLabel: { id: "admin.payoutMegasoft.transferStatus", defaultMessage: "Transfer Status" },
createdDateLabel: { id: "admin.payoutMegasoft.createdDate", defaultMessage: "Created Date" },
detailsLabel: { id: "admin.payoutMegasoft.details", defaultMessage: "Details" },
actionsLabel: { id: "admin.payoutMegasoft.actions", defaultMessage: "Actions" },

paymentMethodFilter: { id: "admin.payoutMegasoft.paymentMethodFilter", defaultMessage: "Payment Method:" },
transferStatusFilter: { id: "admin.payoutMegasoft.transferStatusFilter", defaultMessage: "Transfer Status:" },
allMethods: { id: "admin.payoutMegasoft.allMethods", defaultMessage: "All Methods" },
creditCard: { id: "admin.payoutMegasoft.creditCard", defaultMessage: "Credit Card" },
zelle: { id: "admin.payoutMegasoft.zelle", defaultMessage: "Zelle" },
p2c: { id: "admin.payoutMegasoft.p2c", defaultMessage: "P2C" },
debit: { id: "admin.payoutMegasoft.debit", defaultMessage: "Debit" },
c2p: { id: "admin.payoutMegasoft.c2p", defaultMessage: "C2P" },
allStatus: { id: "admin.payoutMegasoft.allStatus", defaultMessage: "All Status" },
transferred: { id: "admin.payoutMegasoft.transferred", defaultMessage: "Transferred" },
pending: { id: "admin.payoutMegasoft.pending", defaultMessage: "Pending" },

completeTransaction: { id: "admin.payoutMegasoft.completeTransaction", defaultMessage: "Complete Transaction" },
completed: { id: "admin.payoutMegasoft.completed", defaultMessage: "Completed" },
errorLoadingPayouts: { id: "admin.payoutMegasoft.errorLoadingPayouts", defaultMessage: "Error loading payouts" },
megasoftPayouts: { id: "admin.payoutMegasoft.megasoftPayouts", defaultMessage: "Megasoft Payouts" },
payOutManagement: { id: "admin.payoutMegasoft.payOutManagement", defaultMessage: "Pay Out Management" },
  help: {
    id: 'app.help',
    defaultMessage: 'Help',
    description: 'Menu item',
  },
  login: {
    id: 'app.login',
    defaultMessage: 'Login',
    description: 'Menu item',
  },
  signup: {
    id: 'app.signup',
    defaultMessage: 'Signup',
    description: 'Menu item',
  },
  host: {
    id: 'app.host',
    defaultMessage: 'Owner',
    description: 'Menu item',
  },
  manageListing: {
    id: 'app.manageListing',
    defaultMessage: 'Manage cars',
    description: 'Menu item',
  },
  transactionHistory: {
    id: 'app.transactionHistory',
    defaultMessage: 'Transaction history',
    description: 'Menu item',
  },
  profile: {
    id: 'app.profile',
    defaultMessage: 'Profile',
    description: 'Menu item',
  },
  // Language Management Messages
addLanguage :{
  id: 'siteadmin.addLanguage',
  defaultMessage: 'Add Language',
  description: 'Add Language'
},

editLanguage :{
  id: 'siteadmin.editLanguage',
  defaultMessage: 'Edit Language',
  description: 'Edit Language'
},

languagesList : {
  id: 'siteadmin.languagesList',
  defaultMessage: 'Languages List',
  description: 'Languages List'
},languageTitle : {
  id: 'siteadmin.languageTitle',
  defaultMessage: 'Language Title',
  description: 'Language Title'
}, languageCode :  {
  id: 'siteadmin.languageCode',
  defaultMessage: 'Language Code',
  description: 'Language Code'
}, languageFileURL :{
  id: 'siteadmin.languageFileURL',
  defaultMessage: 'Language File URL',
  description: 'Language File URL'
},languageCodeLength :{
  id: 'siteadmin.languageCodeLength',
  defaultMessage: 'Language code must be 2 characters long',
  description: 'Language code length validation message'
},
addLanguage: {
  id: 'siteadmin.addLanguage',
  defaultMessage: 'Add Language',
  description: 'Add Language'
},
editLanguage: {
  id: 'siteadmin.editLanguage',
  defaultMessage: 'Edit Language',
  description: 'Edit Language'
},
languagesList: {
  id: 'siteadmin.languagesList',
  defaultMessage: 'Languages List',
  description: 'Languages List'
},
languageTitle: {
  id: 'siteadmin.languageTitle',
  defaultMessage: 'Language Title',
  description: 'Language Title'
},
languageCode: {
  id: 'siteadmin.languageCode',
  defaultMessage: 'Language Code',
  description: 'Language Code'
},
languageFileURL: {
  id: 'siteadmin.languageFileURL',
  defaultMessage: 'Language File URL',
  description: 'Language File URL'
},
languageCodeLength: {
  id: 'siteadmin.languageCodeLength',
  defaultMessage: 'Language code must be 2 characters long',
  description: 'Language code length validation message'
},
  accountSettings: {
    id: 'app.accountSettings',
    defaultMessage: 'Account Settings',
    description: 'Menu item',
  },
  trips: {
    id: 'app.trips',
    defaultMessage: 'Trips',
    description: 'Menu item',
  },
  messages: {
    id: 'app.messages',
    defaultMessage: 'Messages',
    description: 'Menu item',
  },
  dashboard: {
    id: 'app.dashboard',
    defaultMessage: 'Dashboard',
    description: 'Menu item',
  },
  editProfile: {
    id: 'app.editProfile',
    defaultMessage: 'Edit profile',
    description: 'Menu item',
  },
  logout: {
    id: 'app.logout',
    defaultMessage: 'Logout',
    description: 'Menu item',
  },
  about: {
    id: 'app.about',
    defaultMessage: 'About',
    description: 'Menu item',
  },
  discover: {
    id: 'app.discover',
    defaultMessage: 'Discover',
    description: 'Menu item',
  },
  trustSafety: {
    id: 'app.trustSafety',
    defaultMessage: 'Trust & safety',
    description: 'Menu item',
  },
  hosting: {
    id: 'app.hosting',
    defaultMessage: 'Owner',
    description: 'Menu item',
  },
  termsPrivacy: {
    id: 'app.termsPrivacy',
    defaultMessage: 'Terms & privacy',
    description: 'Menu item',
  },
  or: {
    id: 'app.or',
    defaultMessage: 'or',
    description: 'or',
  },
  signUp: {
    id: 'app.signUp',
    defaultMessage: 'Signup',
    description: 'Signup Button',
  },
  noAccount: {
    id: 'app.noAccount',
    defaultMessage: 'Don’t have an account?',
    description: 'Don’t have an account?',
  },
  email: {
    id: 'app.email',
    defaultMessage: 'Email address',
    description: 'Your email address to Log in',
  },
  hourlyAvailability: {
    id: 'calendar.hourlyAvailability',
    defaultMessage: 'Set Hourly Availability',
    description: 'Title for hourly availability settings'
  },
  toggleHourlySettings: {
    id: 'calendar.toggleHourlySettings',
    defaultMessage: 'Toggle Hourly Settings',
    description: 'Button text for toggling hourly settings'
  },
  startTime: {
    id: 'calendar.startTime',
    defaultMessage: 'Start Time',
    description: 'Label for start time input'
  },
  endTime: {
    id: 'calendar.endTime',
    defaultMessage: 'End Time',
    description: 'Label for end time input'
  },

  emailInvalid: {
    id: 'app.emailInValid',
    defaultMessage: 'Invalid email address',
    description: 'Invalid email address',
  },
  emailNotExists: {
    id: 'app.emailNotExists',
    defaultMessage: 'No account exists for this email. Make sure it\'s typed in correctly, or “sign up” instead',
    description: 'Email Address is not exist',
  },
  urlInvalid: {
    id: 'app.urlInvalid',
    defaultMessage: 'Invalid URL',
    description: 'URL invalid'
  },
  password: {
    id: 'app.password',
    defaultMessage: 'Password',
    description: 'Your Password to Login',
  },
  passwordInvalid: {
    id: 'app.passwordInValid',
    defaultMessage: 'Your password must be at least 8 characters. Please try again',
    description: 'Invalid Password',
  },
  passwordWrong: {
    id: 'app.passwordWrong',
    defaultMessage: 'Wrong password. Please try again',
    description: 'Wrong Password',
  },
  userBannedTitle: {
    id: 'app.userBannedTitle',
    defaultMessage: "We're Sorry!",
    description: 'Not Found',
  },
  userBannedSubTitle: {
    id: 'app.userBannedSubTitle',
    defaultMessage: ' It looks like your account is blocked for some reason. If you need further information, please ',
    description: 'Not Found',
  },
  somethingWentWrong: {
    id: 'app.somethingWentWrong',
    defaultMessage: 'Sorry, something went wrong. Please try again',
    description: 'Wrong went wrong',
  },
  loggedIn: {
    id: 'app.loggedIn',
    defaultMessage: 'You are already logged in!',
    description: 'You are already Logged-in',
  },
  terms1: {
    id: 'app.terms1',
    defaultMessage: 'By signing up, I agree to ',
    description: 'Terms content part1',
  },
  facebook: {
    id: 'app.facebook',
    defaultMessage: 'Facebook',
    description: 'sign up with facebook',
  },
  google: {
    id: 'app.google',
    defaultMessage: 'Google',
    description: 'Signup with google',
  },
  alreadyHaveAccount: {
    id: 'app.alreadyHaveAccount',
    defaultMessage: 'Already have an account?',
    description: 'alreadyHaveAccount',
  },
  termsOfService: {
    id: 'app.termsOfService',
    defaultMessage: 'Terms of Service',
    description: 'Terms of Service',
  },
  firstName: {
    id: 'app.firstName',
    defaultMessage: 'First name',
    description: 'Your First name to Register',
  },
  dateOfBirth: {
    id: 'app.dateOfBirth',
    defaultMessage: 'Birthday',
    description: 'Your Birthday to Register',
  },
  month: {
    id: 'app.month',
    defaultMessage: 'Month',
    description: 'Month of birthday',
  },
  year: {
    id: 'app.year',
    defaultMessage: 'Year',
    description: 'Year of birthday',
  },
  mustBe18OrOld: {
    id: 'app.mustBe18OrOld',
    defaultMessage: 'You must be at least 18 years old',
    description: 'You must at least 18 years old',
  },
  WrongDayChosen: {
    id: 'app.WrongDayChosen',
    defaultMessage: 'Wrong day chosen for the month',
    description: 'Wrong day chosen for the month',
  },
  birthDay: {
    id: 'app.birthDay',
    defaultMessage: 'Birthday',
    description: 'birthday',
  },
  privacyPolicy: {
    id: 'app.privacyPolicy',
    defaultMessage: 'Privacy Policy',
    description: 'Privacy Policy',
  },
  and: {
    id: 'app.and',
    defaultMessage: 'and',
    description: 'And',
  },
  forgotPassword: {
    id: 'app.forgotPassword',
    defaultMessage: 'Forgot password?',
    description: 'Forgot password',
  },
  forgotPasswordInfo: {
    id: 'app.forgotPasswordInfo',
    defaultMessage: 'Enter the email address associated with your account, and we’ll email you a link to reset your password.',
    description: 'Forgot password info',
  },
  backToLogin: {
    id: 'app.backToLogin',
    defaultMessage: 'Back to login',
    description: 'Back to log in',
  },
  sendLink: {
    id: 'app.sendLink',
    defaultMessage: 'Send reset link',
    description: 'Send reset link',
  },
  inbox: {
    id: 'app.inbox',
    defaultMessage: 'Inbox',
    description: 'Inbox',
  },
  yourListings: {
    id: 'app.yourListings',
    defaultMessage: 'Your cars',
    description: 'Your Listings',
  },
  account: {
    id: 'app.account',
    defaultMessage: 'Account',
    description: 'Account',
  },
  trustAndVerification: {
    id: 'app.trustAndVerification',
    defaultMessage: 'Trust and Verification',
    description: 'Trust and Verification',
  },
  reviews: {
    id: 'app.reviews',
    defaultMessage: 'Reviews',
    description: 'Reviews',
  },
  viewProfile: {
    id: 'app.viewProfile',
    defaultMessage: 'View profile',
    description: 'View profile',
  },
  security: {
    id: 'app.security',
    defaultMessage: 'Security',
    description: 'Security',
  },
  where: {
    id: 'app.where',
    defaultMessage: 'Where',
    description: 'Where',
  },
  when: {
    id: 'app.when',
    defaultMessage: 'When',
    description: 'When',
  },
  guest: {
    id: 'app.guest',
    defaultMessage: 'Renter',
    description: 'Guests',
  },
  search: {
    id: 'app.search',
    defaultMessage: 'Search ',
    description: 'Search',
  },
  homeWhere: {
    id: 'app.homeWhere',
    defaultMessage: 'Destination, city, address...',
    description: 'Destination, city, address',
  },
  checkIn: {
    id: 'app.checkIn',
    defaultMessage: 'Trip start',
    description: 'Check In',
  },
  checkOut: {
    id: 'app.checkOut',
    defaultMessage: 'Trip end',
    description: 'Check Out',
  },
  recommended: {
    id: 'app.recommended',
    defaultMessage: 'Recommended cars',
    description: 'Recommended Home page Slider title',
  },
  mostViewed: {
    id: 'app.mostViewed',
    defaultMessage: 'Most viewed',
    description: 'Most Viewed Home page Slider title',
  },
  popularLocation: {
    id: 'app.popularLocation',
    defaultMessage: 'Popular locations',
    description: 'Popular Location Home page Slider title',
  },
  location: {
    id: 'app.location',
    defaultMessage: 'Location',
    description: 'Location',
  },
  dates: {
    id: 'app.dates',
    defaultMessage: 'Trip dates',
    description: 'Dates',
  },
  roomType: {
    id: 'app.roomType',
    defaultMessage: 'Room Type',
    description: 'Type of Room',
  },
  priceRange: {
    id: 'app.priceRange',
    defaultMessage: 'Price Range',
    description: 'Price Range',
  },
  instantBook: {
    id: 'app.instantBook',
    defaultMessage: 'Instant book',
    description: 'Instant Book',
  },
  instantBookInfo: {
    id: 'app.instantBookInfo',
    defaultMessage: 'Trip bookings can be made without waiting for the owner\'s approval.',
    description: 'instant Book Information',
  },
  size: {
    id: 'app.size',
    defaultMessage: 'Size',
    description: 'Size',
  },
  anyBed: {
    id: 'app.anyBed',
    defaultMessage: 'Any bedrooms',
    description: 'Any bedrooms',
  },
  anyBath: {
    id: 'app.anyBath',
    defaultMessage: 'Any bathrooms',
    description: 'Any bathrooms',
  },
  anyBeds: {
    id: 'app.anyBeds',
    defaultMessage: 'Any beds',
    description: 'Any beds',
  },
  filter: {
    id: 'app.filter',
    defaultMessage: 'Filters',
    description: 'Filter button',

  },
  seeHomes: {
    id: 'app.seeHomes',
    defaultMessage: 'See Cars',
    description: 'See Homes',
  },
  rentals: {
    id: 'app.rentals',
    defaultMessage: 'Cars',
    description: 'Rentals',
  },
  aminities: {
    id: 'app.aminities',
    defaultMessage: 'Car features',
    description: 'Amenities',
  },
  facilities: {
    id: 'app.facilities',
    defaultMessage: 'Facilities',
    description: 'Facilities',
  },
  houseRules: {
    id: 'app.houseRules',
    defaultMessage: 'Car rules',
    description: 'House Rules',
  },
  cancel: {
    id: 'app.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button',
  },
  applyFilters: {
    id: 'app.applyFilters',
    defaultMessage: 'View results',
    description: 'Apply filters button',
  },
  filters: {
    id: 'app.filters',
    defaultMessage: 'Filters',
    description: 'Filters button for mobile',
  },
  noResultsTitle: {
    id: 'app.noResultsTitle',
    defaultMessage: 'No results',
    description: 'No results message for search listing',
  },
  noResultsSubTitle: {
    id: 'app.noResultsSubTitle',
    defaultMessage: 'Try adjusting your search. Here are some idea',
    description: 'No results message for search listing',
  },
  noResultsTerms1: {
    id: 'app.noResultsTerms1',
    defaultMessage: 'Change your filters or dates.',
    description: 'No results message for search listing',
  },
  noResultsTerms2: {
    id: 'app.noResultsTerms2',
    defaultMessage: 'Search for a specific city, address.',
    description: 'No results message for search listing',
  },
  aboutListing: {
    id: 'app.aboutListing',
    defaultMessage: 'About the car',
    description: 'View listing description',
  },
  contactHost: {
    id: 'app.contactHost',
    defaultMessage: 'Contact owner',
    description: 'Contact host button and link',
  },
  sharedSpaces: {
    id: 'app.sharedSpaces',
    defaultMessage: 'Insurance',
    description: 'View listing shared spaces',
  },
  cancellations: {
    id: 'app.cancellations',
    defaultMessage: 'Cancellations',
    description: 'View listing cancellations',
  },
  viewDetails: {
    id: 'app.viewDetails',
    defaultMessage: 'View details',
    description: 'Cancellations view details',
  },
  safetyFeatures: {
    id: 'app.safetyFeatures',
    defaultMessage: 'Safety features',
    description: 'View listing Safety features',
  },
  availability: {
    id: 'app.availability',
    defaultMessage: 'Min / Max days',
    description: 'View listing availability',
  },
  in: {
    id: 'app.in',
    defaultMessage: 'in',
    description: 'in',
  },
  guests: {
    id: 'app.guests',
    defaultMessage: 'Renters',
    description: 'Guests',
  },
  noReviewTitle: {
    id: 'app.noReviewTitle',
    defaultMessage: 'This car would love your review',
    description: 'View listing no review title',
  },
  noReviewInfo: {
    id: 'app.noReviewInfo',
    defaultMessage: 'When you rent this car, here’s where your review will show up!',
    description: 'View listing no review info',
  },
  loadMore: {
    id: 'app.loadMore',
    defaultMessage: 'Load more',
    description: 'Load more button',
  },
  viewCountInfo: {
    id: 'app.viewCountInfo',
    defaultMessage: 'This car is on people minds.',
    description: 'View listing view count details',
  },
  viewCountTotal1: {
    id: 'app.viewCountTotal1',
    defaultMessage: 'It’s been viewed',
    description: 'View listing view count details',
  },
  viewCountTotal2: {
    id: 'app.viewCountTotal2',
    defaultMessage: 'times by the people.',
    description: 'View listing view count details',
  },
  neighborhood: {
    id: 'app.neighborhood',
    defaultMessage: 'The neighborhood',
    description: 'View listing neighborhood',
  },
  neighborhoodInfo: {
    id: 'app.neighborhoodInfo',
    defaultMessage: 'Exact location information is provided after a booking is confirmed.',
    description: 'View listing neighborhoodInfo',
  },
  joinedIn: {
    id: 'app.joinedIn',
    defaultMessage: 'Joined in',
    description: 'View listing host joining date',
  },
  contactHostinfo1: {
    id: 'app.contactHostinfo1',
    defaultMessage: 'Make sure you share the following',
    description: 'Contact host instructions',
  },
  contactHostinfo2: {
    id: 'app.contactHostinfo2',
    defaultMessage: 'Tell',
    description: 'Contact host instructions',
  },
  contactHostinfo3: {
    id: 'app.contactHostinfo3',
    defaultMessage: 'a little about yourself',
    description: 'Contact host instructions',
  },
  contactHostinfo6: {
    id: 'app.contactHostinfo6',
    defaultMessage: 'What do you love about this car? Mention it',
    description: 'Contact host instructions',
  },
  contactHost7: {
    id: 'app.contactHostinfo7',
    defaultMessage: 'What brings you to long? Who’s joining with you?',
    description: 'What brings you to long? Who’s joining with you?',
  },
  hostErrorMessage1: {
    id: 'app.hostErrorMessage1',
    defaultMessage: 'Please specify trip start and trip end',
    description: 'Contact host error message',
  },
  hostErrorMessage2: {
    id: 'app.hostErrorMessage2',
    defaultMessage: 'Those dates are not available',
    description: 'Contact host error message',
  },
  hostErrorMessage3: {
    id: 'app.hostErrorMessage3',
    defaultMessage: 'You can contact the car owner now',
    description: 'Contact host error message',
  },
  textBoxMessage: {
    id: 'app.textBoxMessage',
    defaultMessage: 'Enter your message...',
    description: 'Contact host text box start your message',
  },
  sendMessage: {
    id: 'app.sendMessage',
    defaultMessage: 'Send message',
    description: 'Contact host button',
  },
  contacthostError2: {
    id: 'app.contacthostError2',
    defaultMessage: '*Required',
    description: 'Contact host error message',
  },
  serviceFee: {
    id: 'app.serviceFee',
    defaultMessage: 'Service fee',
    description: 'Bill details',
  },
  cleaningFee: {
    id: 'app.cleaningFee',
    defaultMessage: 'Delivery fee',
    description: 'Bill details',
  },
  total: {
    id: 'app.total',
    defaultMessage: 'Total',
    description: 'Bill details',
  },
  nights: {
    id: 'app.nights',
    defaultMessage: 'days',
    description: 'Bill details',
  },
  viewOtherListings: {
    id: 'app.viewOtherListings',
    defaultMessage: 'View other cars',
    description: 'Booking button',
  },
  book: {
    id: 'app.book',
    defaultMessage: 'Book',
    description: 'Booking button',
  },
  requestToBook: {
    id: 'app.requestToBook',
    defaultMessage: 'Request to book',
    description: 'Booking button',
  },
  maximumStay: {
    id: 'app.maximumStay',
    defaultMessage: 'Maximum rent is',
    description: 'Maximum day error',
  },
  perNight: {
    id: 'app.perNight',
    defaultMessage: '/ day',
    description: '/ day',
  },
  perHour: {
    id: 'app.perHour',
    defaultMessage: '/ hour',
    description: '/ hour',
  },
  bookingInfo: {
    id: 'app.bookingInfo',
    defaultMessage: 'You won’t be charged yet',
    description: 'You won’t be charged yet',
  },
  cancellationPolicies: {
    id: 'app.cancellationPolicies',
    defaultMessage: 'Cancellation policies',
    description: 'Cancellation Policies',
  },
  flexible: {
    id: 'app.flexible',
    defaultMessage: 'Flexible',
    description: 'Flexible',
  },
  moderate: {
    id: 'app.moderate',
    defaultMessage: 'Moderate',
    description: 'Moderate',
  },
  strict: {
    id: 'app.strict',
    defaultMessage: 'Strict',
    description: 'Strict',
  },
  addProfilePhoto: {
    id: 'app.addProfilePhoto',
    defaultMessage: 'Add your profile photo',
    description: 'Avatar upload title',
  },
  uploadInfo: {
    id: 'app.uploadInfo',
    defaultMessage: 'This helps your owner recognize when you meet, so make sure it shows your face.',
    description: 'Avatar upload info',
  },
  continue: {
    id: 'app.continue',
    defaultMessage: 'Continue',
    description: 'Continue button',
  },
  meetupTitle: {
    id: 'app.meetupTitle',
    defaultMessage: 'Get ready to book with',
    description: 'Get ready to book with',
  },
  meetupInfo1: {
    id: 'app.meetupInfo1',
    defaultMessage: 'We will ask everyone to confirm a few things before you take the wheel.',
    description: 'Meetup information',
  },
  meetupInfo2: {
    id: 'app.meetupInfo2',
    defaultMessage: 'You’ll only have to do this once.',
    description: 'Meetup information',
  },
  next: {
    id: 'app.next',
    defaultMessage: 'Next',
    description: 'Next button',
  },
  checkEmail: {
    id: 'app.checkEmail',
    defaultMessage: 'Check your email',
    description: 'Email verification title',
  },
  verificationInfo1: {
    id: 'app.verificationInfo1',
    defaultMessage: 'Tap the link in the email we sent you.',
    description: 'Verification info',
  },
  verificationInfo2: {
    id: 'app.verificationInfo2',
    defaultMessage: 'Confirming your email address helps us send you trip information. If not received kindly click here to resend the email.',
    description: 'Verification info',
  },
  resendEmail: {
    id: 'app.resendEmail',
    defaultMessage: 'Resend email',
    description: 'Resend email button',
  },
  aboutYourTrip: {
    id: 'app.aboutYourTrip',
    defaultMessage: 'About your trip',
    description: 'Payment About Your Ride',
  },
  sayHello: {
    id: 'app.sayHello',
    defaultMessage: 'Say hello to your car owner and tell them why you\’re coming.',
    description: 'Payment page info',
  },
  descriptionInfo: {
    id: 'app.descriptionInfo',
    defaultMessage: 'Driving around the city? Going on a long trip? This helps the car owner to prepare the car for your trip.',
    description: 'Payment description information',
  },
  payment: {
    id: 'app.payment',
    defaultMessage: 'Payment',
    description: 'Payment',
  },
  paymentInfo: {
    id: 'app.paymentInfo',
    defaultMessage: 'You’ll only be charged if your request is accepted by the car owner. They’ll have 24 hours to accept or decline.',
    description: 'Payment information',
  },
  paymentCurrency: {
    id: 'app.paymentCurrency',
    defaultMessage: 'Payment currency',
    description: 'Payment currency',
  },
  chooseCurrency: {
    id: 'app.chooseCurrency',
    defaultMessage: 'Choose currency',
    description: 'Choose currency',
  },
  paypal: {
    id: 'app.paypal',
    defaultMessage: 'PayPal',
    description: 'Paypal',
  },
  loginInfo: {
    id: 'app.loginInfo',
    defaultMessage: 'Log into PayPal. You will be able to review your request before it is final.',
    description: 'Login information',
  },
  hostedBy: {
    id: 'app.hostedBy',
    defaultMessage: 'Owned by',
    description: 'Hosted by',
  },
  cancellationPolicy: {
    id: 'app.cancellationPolicy',
    defaultMessage: 'Cancellation policy',
    description: 'Cancellation policy',
  },
  hourlyAvailability: {
    id: 'app.hourlyAvailability',
    defaultMessage: 'Set Hourly Availability',
    description: 'Set Hourly Availability',

  },
  startTime: {
    id: 'app.startTime',
    defaultMessage: 'Start Time',
    description: 'Start Time',

  },
  endTime: {
    id: 'app.endTime',
    defaultMessage: 'End Time',
    description: 'End Time',

  },
  toggleHourlySettings: {
    id: 'toggleHourlySettings',
    defaultMessage: 'Set Hourly Availability',
  },
  deleteListing: {
    id: 'app.deleteListing',
    defaultMessage: 'Delete this car',
    description: 'Manage listing delete this listing',
  },
  deleteListingInfo: {
    id: 'app.deleteListingInfo',
    defaultMessage: 'Are you sure you want to delete this car? You cannot reverse this action.',
    description: 'Manage listing delete listing information',
  },
  delete: {
    id: 'app.delete',
    defaultMessage: 'Delete',
    description: 'Manage listing Delete button',
  },
  goBack: {
    id: 'app.goBack',
    defaultMessage: 'Go back',
    description: 'Manage listing Go back button',
  },
  progressBarText1: {
    id: 'app.progressBarText1',
    defaultMessage: 'You’re',
    description: 'Manage listing Progress bar text',
  },
  progressBarText2: {
    id: 'app.progressBarText2',
    defaultMessage: 'done with your listing',
    description: 'Manage listing Progress bar text',
  },
  listingUpdateInfo: {
    id: 'app.listingUpdateInfo',
    defaultMessage: 'Last edited on',
    description: 'Manage listing update info',
  },
  editListing: {
    id: 'app.editListing',
    defaultMessage: 'Edit listing',
    description: 'Manage listing button',
  },
  finishListing: {
    id: 'app.finishListing',
    defaultMessage: 'Finish the listing',
    description: 'Manage listing button',
  },
  preview: {
    id: 'app.preview',
    defaultMessage: 'Preview',
    description: 'Manage listing button',
  },
  listed: {
    id: 'app.listed',
    defaultMessage: 'Listed',
    description: 'Manage listing dropdown',
  },
  unListed: {
    id: 'app.unListed',
    defaultMessage: 'Unlisted',
    description: 'Manage listing dropdown',
  },
  title: {
    id: 'app.title',
    defaultMessage: 'You don\'t have any listings!',
    description: 'You don\'t have any listings!',
  },
  content: {
    id: 'app.content',
    defaultMessage: 'Make money by renting out your cars and letting people take them out on trips.',
    description: 'content',
  },
  noTripTitle2: {
    id: 'app.noTripTitle2',
    defaultMessage: 'Start planning your first adventure and the time to explore the unseen',
    description: 'No trips title',
  },
  noTripTitle3: {
    id: 'app.noTripTitle3',
    defaultMessage: 'Start planning your next adventure and the time to explore the unseen',
    description: 'No trips title',
  },
  noReservation: {
    id: 'app.noReservation',
    defaultMessage: 'You don\'t have any reservations!',
    description: 'No reservation',
  },
  status: {
    id: 'app.status',
    defaultMessage: 'Status',
    description: 'Status',
  },
  details: {
    id: 'app.details',
    defaultMessage: 'Details',
    description: 'Details',
  },
  noList: {
    id: 'app.noList',
    defaultMessage: 'No List Found',
    description: 'No List Found',
  },
  notexist: {
    id: 'app.notexist',
    defaultMessage: 'Renter profile doesn\'t exist',
    description: 'Guest profile not exist',
  },
  messageHistroy: {
    id: 'app.messageHistroy',
    defaultMessage: 'Chat',
    description: 'Chat',
  },
  contactSupport: {
    id: 'app.contactSupport',
    defaultMessage: 'Contact Support',
    description: 'Contact Support',
  },
  viewItinerary: {
    id: 'app.viewItinerary',
    defaultMessage: 'View itinerary',
    description: 'View itinerary',
  },
  viewReceipt: {
    id: 'app.viewReceipt',
    defaultMessage: 'View receipt',
    description: 'View receipt',
  },
  approve: {
    id: 'app.approve',
    defaultMessage: 'Approve',
    description: 'Approve',
  },
  decline: {
    id: 'app.decline',
    defaultMessage: 'Decline',
    description: 'Decline',
  },
  lastName: {
    id: 'app.lastName',
    defaultMessage: 'Last name',
    description: 'Your last name to Register',
  },
  emailAlreadyExists: {
    id: 'app.emailAlreadyExists',
    defaultMessage: 'That email address is already in use. Please choose different one!',
    description: 'Email Address is already exist',
  },
  gender: {
    id: 'app.gender',
    defaultMessage: 'Gender',
    description: 'Gender Field',
  },
  genderMale: {
    id: 'app.genderMale',
    defaultMessage: 'Male',
    description: 'Gender Male',
  },
  genderFemale: {
    id: 'app.genderFemale',
    defaultMessage: 'Female',
    description: 'Gender Female',
  },
  genderOther: {
    id: 'app.genderOther',
    defaultMessage: 'Other',
    description: 'Gender Other',
  },
  phoneNumber: {
    id: 'app.phoneNumber',
    defaultMessage: 'Phone number',
    description: 'Phone Number',
  },
  phoneNumberInvalid: {
    id: 'app.phoneNumberInvalid',
    defaultMessage: 'Invalid phone number',
    description: 'Phone Number is Invalid',
  },
  phoneNumberLengthInvalid: {
    id: 'app.phoneNumberLengthInvalid',
    defaultMessage: 'Mobile number must be 30 characters or less',
    description: 'Mobile Number must be 30 characters or less'
  },
  info: {
    id: 'app.info',
    defaultMessage: 'Describe yourself',
    description: 'Describe Yourself',
  },
  somethingWentWrong: {
    id: 'app.somethingWentWrong',
    defaultMessage: 'Sorry, something went wrong. Please try again',
    description: 'Wrong went wrong',
  },
  notLoggedIn: {
    id: 'app.notLoggedIn',
    defaultMessage: 'You are not logged In. Please log in to continue!',
    description: 'Wrong went wrong',
  },
  dateOfBirth: {
    id: 'app.dateOfBirth',
    defaultMessage: 'Birthday',
    description: 'Your Birthday to Register',
  },
  save: {
    id: 'app.save',
    defaultMessage: 'Save',
    description: 'Save Button',
  },
  month: {
    id: 'app.month',
    defaultMessage: 'Month',
    description: 'Month of birthday',
  },
  year: {
    id: 'app.year',
    defaultMessage: 'Year',
    description: 'Year of birthday',
  },
  birthDayRequired: {
    id: 'app.birthDayRequired',
    defaultMessage: 'Select your birth date to continue',
    description: 'birthDayRequired',
  },
  mustBe18OrOld: {
    id: 'app.mustBe18OrOld',
    defaultMessage: 'You must be at least 18 years old',
    description: 'You must at least 18 years old',
  },
  WrongDayChosen: {
    id: 'app.WrongDayChosen',
    defaultMessage: 'Wrong day chosen for the month',
    description: 'Wrong day chosen for the month',
  },
  Required: {
    id: 'app.Required',
    defaultMessage: 'Required details',
    description: 'Required Heading',
  },
  lastNameInfo: {
    id: 'app.lastNameInfo',
    defaultMessage: 'This will be considered while showing the booking informations.',
    description: 'lastNameInfo',
  },
  phoneNumberInfo: {
    id: 'app.phoneNumberInfo',
    defaultMessage: 'Once you confirmed your number, this will help the users to interact when they have bookings.',
    description: 'phoneNumberInfo',
  },
  profilePhotoInfo: {
    id: 'app.profilePhotoInfo',
    defaultMessage: 'Clear frontal face photos are an important way for car owners and renters to learn about each other. It’s not much fun to rent a car! Please upload a photo that clearly shows your face.',
    description: 'Profile photo upload information',
  },
  verifiedInfo: {
    id: 'app.verifiedInfo',
    defaultMessage: 'Verified info',
    description: 'Verified info',
  },
  verifiedEmail: {
    id: 'app.verifiedEmail',
    defaultMessage: 'Your email address has been verified ',
    description: 'You have verified your email address.',
  },
  facebookInfo: {
    id: 'app.facebookInfo',
    defaultMessage: 'Sign in with Facebook and discover your trusted connections to hosts and guests all over the world.',
    description: 'Facebook information',
  },
  disconnect: {
    id: 'app.disconnect',
    defaultMessage: 'Disconnect',
    description: 'Disconnect button',
  },
  googleInfo1: {
    id: 'app.googleInfo1',
    defaultMessage: 'Connect your',
    description: 'Google information',
  },
  googleInfo2: {
    id: 'app.googleInfo2',
    defaultMessage: 'account to the Google account for simplicity and ease.',
    description: 'Google information',
  },
  notVerifiedDetails: {
    id: 'app.notVerifiedDetails',
    defaultMessage: 'You haven\'t verified any of the below items',
    description: 'Not verified information',
  },
  notVerifiedInfo: {
    id: 'app.notVerifiedInfo',
    defaultMessage: 'Not verified info',
    description: 'Not verified info',
  },
  pleaseVerify: {
    id: 'app.pleaseVerify',
    defaultMessage: 'Please verify your email address.',
    description: 'Verify your email address.',
  },
  connect: {
    id: 'app.connect',
    defaultMessage: 'Connect',
    description: 'Connect button',
  },
  reviewTitle: {
    id: 'app.reviewTitle',
    defaultMessage: 'Thank you for reviewing.',
    description: 'Review',
  },
  reviewTitle2: {
    id: 'app.reviewTitle2',
    defaultMessage: 'Your review will be visible on their profile.',
    description: 'Review',
  },
  finish: {
    id: 'app.finish',
    defaultMessage: 'Finish',
    description: 'Finish button',
  },
  reviewPageTitle: {
    id: 'app.reviewPageTitle',
    defaultMessage: 'Describe your experience',
    description: 'Review',
  },
  reviewPageTitle1: {
    id: 'app.reviewPageTitle1',
    defaultMessage: 'Your review will be public on your renter profile',
    description: 'Review',
  },
  reviewPageTitle2: {
    id: 'app.reviewPageTitle2',
    defaultMessage: 'Your review will be public on your owner profile',
    description: 'Review',
  },
  reviewTextArea: {
    id: 'app.reviewTextArea',
    defaultMessage: 'Enter your review message here…',
    description: 'Review',
  },
  reviewRating: {
    id: 'app.reviewRating',
    defaultMessage: 'Overall rating',
    description: 'Review',
  },
  submit: {
    id: 'app.submit',
    defaultMessage: 'Submit',
    description: 'Submit button',
  },
  reviewError1: {
    id: 'app.reviewError1',
    defaultMessage: 'Please write your review!',
    description: 'Review',
  },
  reviewError2: {
    id: 'app.reviewError2',
    defaultMessage: 'Please rate your review!',
    description: 'Review',
  },
  response: {
    id: 'app.response',
    defaultMessage: 'response',
    description: 'Review',
  },
  writeReview: {
    id: 'app.writeReview',
    defaultMessage: 'Write a review',
    description: 'Review',
  },
  viewLitneray: {
    id: 'app.viewLitneray',
    defaultMessage: 'View itinerary',
    description: 'Review',
  },
  hey: {
    id: 'app.hey',
    defaultMessage: 'Hey I’m',
    description: 'View profile',
  },
  reportUser: {
    id: 'app.reportUser',
    defaultMessage: 'Report this user',
    description: 'View profile',
  },
  noVerifications: {
    id: 'app.noVerifications',
    defaultMessage: 'No verifications yet',
    description: 'View profile',
  },
  addVerifications: {
    id: 'app.addVerifications',
    defaultMessage: 'Add more verifications',
    description: 'View profile',
  },
  emailConfirmed: {
    id: 'app.emailConfirmed',
    defaultMessage: 'Email confirmed',
    description: 'View profile',
  },
  fbConnected: {
    id: 'app.fbConnected',
    defaultMessage: 'Facebook connected',
    description: 'View profile',
  },
  googleConnected: {
    id: 'app.googleConnected',
    defaultMessage: 'Google connected',
    description: 'View profile',
  },
  moreVerifications: {
    id: 'app.moreVerifications',
    defaultMessage: 'Add more verifications',
    description: 'View profile',
  },
  addPayout: {
    id: 'app.addPayout',
    defaultMessage: 'Add payout method',
    description: 'Payout',
  },
  address1: {
    id: 'app.address1',
    defaultMessage: 'Address line 1',
    description: 'Payout Form',
  },
  address2: {
    id: 'app.address2',
    defaultMessage: 'Address line 2',
    description: 'Payout Form',
  },
  city: {
    id: 'app.city',
    defaultMessage: 'City',
    description: 'Payout Form',
  },
  state: {
    id: 'app.state',
    defaultMessage: 'State / Province',
    description: 'Payout Form',
  },
  zipCode: {
    id: 'app.zipCode',
    defaultMessage: 'ZIP code / Postal code',
    description: 'Payout Form',
  },
  payoutError5: {
    id: 'app.payoutError5',
    defaultMessage: 'Enter valid email address',
    description: 'Payout Form',
  },
  country: {
    id: 'app.country',
    defaultMessage: 'Country',
    description: 'Payout Form',
  },
  chooseCountry: {
    id: 'app.chooseCountry',
    defaultMessage: 'Choose country',
    description: 'Payout Form',
  },
  back: {
    id: 'app.back',
    defaultMessage: 'Back',
    description: 'Back button',
  },
  paypalIntro1: {
    id: 'app.paypalIntro1',
    defaultMessage: 'PayPal is an online payment processing service that allows you to receive payments from',
    description: 'Paypal intro',
  },
  paypalIntro2: {
    id: 'app.paypalIntro2',
    defaultMessage: 'To use paypal with',
    description: 'Paypal intro',
  },
  paypalIntro3: {
    id: 'app.paypalIntro3',
    defaultMessage: 'you must have an existing account with PayPal.',
    description: 'Paypal intro',
  },
  paypalIntro4: {
    id: 'app.paypalIntro4',
    defaultMessage: 'Learn more about paypal',
    description: 'Paypal intro',
  },
  paypalEmail: {
    id: 'app.paypalEmail',
    defaultMessage: 'Enter the email address associated with your existing Paypal account.',
    description: 'Paypal email',
  },
  paypalCurrency: {
    id: 'app.paypalCurrency',
    defaultMessage: 'In what currency would you like to be paid?',
    description: 'Paypal currency',
  },
  payoutIntro1: {
    id: 'app.payoutIntro1',
    defaultMessage: 'Payouts for reservations are released to you the day after your renter completed the trip, and it takes some additional time for the money to arrive depending on your payout method',
    description: 'Payout intro',
  },
  payoutIntro2: {
    id: 'app.payoutIntro2',
    defaultMessage: 'We can send money to people in your region with these payout methods. Which do you prefer?',
    description: 'Payout intro',
  },
  payoutTitle: {
    id: 'app.payoutTitle',
    defaultMessage: 'Methods',
    description: 'Payout header',
  },
  payoutTitle1: {
    id: 'app.payoutTitle1',
    defaultMessage: 'Processed in',
    description: 'Payout header',
  },
  payoutTitle2: {
    id: 'app.payoutTitle2',
    defaultMessage: 'Fees',
    description: 'Payout header',
  },
  payoutTitle3: {
    id: 'app.payoutTitle3',
    defaultMessage: 'Currency',
    description: 'Payout header',
  },
  payoutTitle4: {
    id: 'app.payoutTitle4',
    defaultMessage: 'Details',
    description: 'Payout header',
  },
  noPaymentFound: {
    id: 'app.noPaymentFound',
    defaultMessage: 'No Payment method found',
    description: 'No payment',
  },
  payoutMethod: {
    id: 'app.payoutMethod',
    defaultMessage: 'Payout methods',
    description: 'Payout method',
  },
  addPayoutMethod: {
    id: 'app.addPayoutMethod',
    defaultMessage: 'To get paid, you need to set up a payout method',
    description: 'Payout Method',
  },
  paymentReleaseInfo1: {
    id: 'app.paymentReleaseInfo1',
    defaultMessage: 'releases payouts about 24 hours after a renter’s completed the trip.',
    description: 'Payout Method',
  },
  paymentReleaseInfo2: {
    id: 'app.paymentReleaseInfo2',
    defaultMessage: 'The time it takes for the funds to appear in your account depends on your payout method and region payment process timelines.',
    description: 'Payout Method',
  },
  payoutTitleBlock1: {
    id: 'app.payoutTitleBlock1',
    defaultMessage: 'When you receive a payment for a reservation, we call that payment to you a “payout”. Our secure payment system supports several payout methods, which can be setup and managed here. Your available payout options and currencies differ by your region/country.',
    description: 'Payout Method',
  },
  default: {
    id: 'app.default',
    defaultMessage: 'Default',
    description: 'Payout Method',
  },
  ready: {
    id: 'app.ready',
    defaultMessage: 'Ready',
    description: 'Payout Method',
  },
  setDefault: {
    id: 'app.setDefault',
    defaultMessage: 'Set default',
    description: 'Payout Method',
  },
  remove: {
    id: 'app.remove',
    defaultMessage: 'Remove',
    description: 'Payout Method',
  },
  directDeposit: {
    id: 'app.directDeposit',
    defaultMessage: 'Direct Deposit, PayPal, etc..',
    description: 'Payout Method',
  },
  transactionPayout: {
    id: 'app.transactionPayout',
    defaultMessage: 'Payout',
    description: 'Transaction history',
  },
  transferTo: {
    id: 'app.transferTo',
    defaultMessage: 'Transfer to',
    description: 'Transaction history',
  },
  transferDate: {
    id: 'app.transferDate',
    defaultMessage: 'Date',
    description: 'Date',
  },
  transferType: {
    id: 'app.transferType',
    defaultMessage: 'Type',
    description: 'Type',
  },
  transferAmount: {
    id: 'app.transferAmount',
    defaultMessage: 'Amount',
    description: 'Amount',
  },
  paidOut: {
    id: 'app.paidOut',
    defaultMessage: 'Paid Out',
    description: 'Paid Out',
  },
  reservation: {
    id: 'app.reservation',
    defaultMessage: 'Reservation',
    description: 'Reservation',
  },
  payTo: {
    id: 'app.payTo',
    defaultMessage: 'Pay to',
    description: 'Pay to',
  },
  grossEarnings: {
    id: 'app.grossEarnings',
    defaultMessage: 'Gross earnings',
    description: 'Gross Earnings',
  },
  noTransactions: {
    id: 'app.noTransactions',
    defaultMessage: 'No transactions!',
    description: 'No transactions!',
  },
  transactionsAddPayout: {
    id: 'app.transactionsAddPayout',
    defaultMessage: 'Add Payout',
    description: 'Transaction payout',
  },
  completedTransactions: {
    id: 'app.completedTransactions',
    defaultMessage: 'Completed',
    description: 'Completed Transactions',
  },
  futureTransactions: {
    id: 'app.futureTransactions',
    defaultMessage: 'Future transactions',
    description: 'Completed Transactions',
  },
  exportCSV: {
    id: 'app.exportCSV',
    defaultMessage: 'Export to CSV',
    description: 'Export to CSV',
  },
  changePassword: {
    id: 'app.changePassword',
    defaultMessage: 'Change your password',
    description: 'Change Your Password',
  },
  oldPassword: {
    id: 'app.oldPassword',
    defaultMessage: 'Current password',
    description: 'Current password',
  },
  newPassword: {
    id: 'app.newPassword',
    defaultMessage: 'Enter your new password',
    description: 'New password',
  },
  confirmPassword: {
    id: 'app.confirmPassword',
    defaultMessage: 'Confirm Password',
    description: 'Confirm Password',
  },
  updatePassword: {
    id: 'app.updatePassword',
    defaultMessage: 'Update password',
    description: 'Update password',
  },
  passwordError3: {
    id: 'app.passwordError3',
    defaultMessage: 'New password must be minimum 8 characters',
    description: 'Password Error',
  },
  passwordError5: {
    id: 'app.passwordError5',
    defaultMessage: 'Confirm password must be minimum 8 characters',
    description: 'Password Error',
  },
  noMessagesTitle: {
    id: 'app.noMessagesTitle',
    defaultMessage: 'No Messages yet!',
    description: 'Inbox',
  },
  noMessagesTitle2: {
    id: 'app.noMessagesTitle2',
    defaultMessage: "When owners respond to your inquiries or booking requests, you'll see their messages here.",
    description: 'Inbox',
  },
  noMessagesTitle3: {
    id: 'app.noMessagesTitle3',
    defaultMessage: "When renters respond to your inquiries or booking requests, you'll see their messages here.",
    description: 'Inbox',
  },
  traveling: {
    id: 'app.traveling',
    defaultMessage: 'Renter',
    description: 'Traveling',
  },
  errorMessage: {
    id: 'app.errorMessage',
    defaultMessage: 'Oops something went wrong, refresh or check back later',
    description: 'Error message',
  },
  receipt: {
    id: 'app.receipt',
    defaultMessage: 'Receipt',
    description: 'Receipt',
  },
  customerReceipt: {
    id: 'app.customerReceipt',
    defaultMessage: 'Customer receipt',
    description: 'Customer Receipt',
  },
  confirmationCode: {
    id: 'app.confirmationCode',
    defaultMessage: 'Confirmation code',
    description: 'Confirmation Code',
  },
  name: {
    id: 'app.name',
    defaultMessage: 'Name',
    description: 'Name',
  },
  travelDestination: {
    id: 'app.travelDestination',
    defaultMessage: 'Destination',
    description: 'Destination',
  },
  duration: {
    id: 'app.duration',
    defaultMessage: 'Duration',
    description: 'Duration',
  },
  receiptInfo1: {
    id: 'app.receiptInfo1',
    defaultMessage: 'is authorized to accept reservation on behalf of the Car Owner as their limited agent.',
    description: 'Receipt information',
  },
  receiptInfo2: {
    id: 'app.receiptInfo2',
    defaultMessage: 'This means that your payment obligation to the Car Owner is satisfied by your payment to',
    description: 'Receipt information',
  },
  receiptInfo3: {
    id: 'app.receiptInfo3',
    defaultMessage: 'Any of the host\'s disagreement regarding that payment must be settled between the Car Owner and',
    description: 'Receipt information',
  },
  itinerayTitle: {
    id: 'app.itinerayTitle',
    defaultMessage: 'Your booking is confirmed!',
    description: 'Itinerary',
  },
  address: {
    id: 'app.address',
    defaultMessage: 'Address',
    description: 'Itinerary',
  },
  viewListing: {
    id: 'app.viewListing',
    defaultMessage: 'View car',
    description: 'View Listing',
  },
  messageHost: {
    id: 'app.messageHost',
    defaultMessage: 'Message owner',
    description: 'Itinerary',
  },
  billing: {
    id: 'app.billing',
    defaultMessage: 'Billing',
    description: 'Itinerary',
  },
  messageAction1: {
    id: 'app.messageAction1',
    defaultMessage: 'You messaged',
    description: 'View message',
  },
  messageAction2: {
    id: 'app.messageAction2',
    defaultMessage: 'about their listing',
    description: 'View message',
  },
  messageActionInfo: {
    id: 'app.messageActionInfo',
    defaultMessage: 'Most owners respond within 24 hours. If this listing is your top choice, enter your payment information to officially request a reservation.',
    description: 'View message',
  },
  messageAction3: {
    id: 'app.messageAction3',
    defaultMessage: 'Your booking request sent to',
    description: 'View message',
  },
  messageAction4: {
    id: 'app.messageAction4',
    defaultMessage: 'for their car',
    description: 'View message',
  },
  cancelReservation: {
    id: 'app.cancelReservation',
    defaultMessage: 'Cancel reservation',
    description: 'Cancel Reservation',
  },
  requestDeclined: {
    id: 'app.requestDeclined',
    defaultMessage: 'Request declined',
    description: 'Request declined',
  },
  guestDeclinedInfo: {
    id: 'app.guestDeclinedInfo',
    defaultMessage: 'Your request is declined by owner. You can choose different dates or search for other car.',
    description: 'Request declined',
  },
  requestApprovedAction1: {
    id: 'app.requestApprovedAction1',
    defaultMessage: 'Your booking request approved by',
    description: 'Request approved',
  },
  requestTimeInfo1: {
    id: 'app.requestTimeInfo1',
    defaultMessage: 'You have to book within',
    description: 'Request approved',
  },
  requestTimeInfo2: {
    id: 'app.requestTimeInfo2',
    defaultMessage: 'or it will expire.',
    description: 'Request approved',
  },
  bookingConfirmedInfo1: {
    id: 'app.bookingConfirmedInfo1',
    defaultMessage: 'Your booking is confirmed with',
    description: 'Booking confirmed',
  },
  bookingCanceledInfo: {
    id: 'app.bookingCanceledInfo',
    defaultMessage: 'You can contact your car owner and do necessary arrangements or you can cancel your reservation.',
    description: 'Booking canceld',
  },
  bookingExpiredTitle: {
    id: 'app.bookingExpiredTitle',
    defaultMessage: 'Your booking request has expired.',
    description: 'Booking expired',
  },
  bookingExpiredInfo: {
    id: 'app.bookingExpiredInfo',
    defaultMessage: 'Try sending request again or send an inquiry to get in touch with the owner',
    description: 'Booking expired',
  },
  gotoListing: {
    id: 'app.gotoListing',
    defaultMessage: 'Go to Listing',
    description: 'Go to Listing',
  },
  bookingRequestCancel1: {
    id: 'app.bookingRequestCancel',
    defaultMessage: 'Booking request is cancelled',
    description: 'Booking request is cancelled',
  },
  bookingRequestCancel2: {
    id: 'app.bookingRequestCance2',
    defaultMessage: 'Your booking request is cancelled.',
    description: 'BYour booking request is cancelled.',
  },
  tripCompleted1: {
    id: 'app.tripCompleted1',
    defaultMessage: 'Trip is completed',
    description: 'Trip is completed',
  },
  tripCompleted2: {
    id: 'app.tripCompleted2',
    defaultMessage: 'Your trip is completed.',
    description: 'Your trip is completed.',
  },
  reservationCompleted1: {
    id: 'app.reservationCompleted1',
    defaultMessage: 'Reservation is completed',
    description: 'Reservation is completed',
  },
  reservationCompleted2: {
    id: 'app.reservationCompleted2',
    defaultMessage: 'Reservation of your listing is completed.',
    description: 'Reservation of your listing is completed.',
  },
  hostAction1: {
    id: 'app.hostAction1',
    defaultMessage: 'Invite',
    description: 'Host Action Block.',
  },
  hostAction2: {
    id: 'app.hostAction2',
    defaultMessage: 'to book by pre-approving this trip',
    description: 'Host Action Block.',
  },
  hostAction3: {
    id: 'app.hostAction3',
    defaultMessage: 'Let',
    description: 'Host Action Block.',
  },
  hostAction4: {
    id: 'app.hostAction4',
    defaultMessage: 'know these dates are available by pre-approving them.',
    description: 'Host Action Block.',
  },
  hostResponseTime1: {
    id: 'app.hostResponseTime1',
    defaultMessage: 'Respond within',
    description: 'Host Action Block.',
  },
  hostResponseTime2: {
    id: 'app.hostResponseTime2',
    defaultMessage: 'to maintain your response rate.',
    description: 'Host Action Block.',
  },
  preApprove: {
    id: 'app.preApprove',
    defaultMessage: 'Pre-approve',
    description: 'Pre-approve',
  },
  guestRequest: {
    id: 'app.guestRequest',
    defaultMessage: 'sent a request to booking for your car',
    description: 'Guest Request',
  },
  requestApproved: {
    id: 'app.requestApproved',
    defaultMessage: 'Request Approved',
    description: 'Request Approved',
  },
  timeToExpire: {
    id: 'app.timeToExpire',
    defaultMessage: 'Your renter have 24 hours to respond to this or it will get expired',
    description: 'Time To Expire',
  },
  declinedInfo: {
    id: 'app.declinedInfo',
    defaultMessage: 'Make sure your calendar is up-to-date and that your vehicle page accurately reflects your car rules and requirements.',
    description: 'Declined Info',
  },
  bookingIsConfirmed: {
    id: 'app.bookingIsConfirmed',
    defaultMessage: 'Booking is confirmed',
    description: 'Booking is confirmed',
  },
  contactGuest: {
    id: 'app.contactGuest',
    defaultMessage: 'You can contact your renter and do necessary arrangements or you can cancel.',
    description: 'Contact Guest',
  },
  bookingIsExpired: {
    id: 'app.bookingIsExpired',
    defaultMessage: 'Booking request is expired',
    description: 'Booking request is expired',
  },
  bookingIsExpired1: {
    id: 'app.bookingIsExpired1',
    defaultMessage: 'booking request is expired.',
    description: 'booking request is expired.',
  },
  bookingRequestCancel3: {
    id: 'app.bookingRequestCance3',
    defaultMessage: 'booking request is cancelled.',
    description: 'booking request is cancelled.',
  },
  writeMessage: {
    id: 'app.writeMessage',
    defaultMessage: 'Enter your message',
    description: 'Write your message',
  },
  noItmesFound: {
    id: 'app.noItmesFound',
    defaultMessage: 'No items found',
    description: 'No items found',
  },
  messageStatus1: {
    id: 'app.messageStatus1',
    defaultMessage: 'Inquiry',
    description: 'Message Status',
  },
  earnedAmount: {
    id: 'app.earnedAmount',
    defaultMessage: 'Earned amount',
    description: 'Payment details',
  },
  missedEarnings: {
    id: 'app.missedEarnings',
    defaultMessage: 'Missed earnings',
    description: 'Missed earnings',
  },
  refundAmount: {
    id: 'app.refundAmount',
    defaultMessage: 'Refund amount',
    description: 'Refund Amount',
  },
  subTotal: {
    id: 'app.subTotal',
    defaultMessage: 'Subtotal',
    description: 'Payment details',
  },
  youEarn: {
    id: 'app.youEarn',
    defaultMessage: 'You earn',
    description: 'Payment details',
  },
  tripDetails: {
    id: 'app.tripDetails',
    defaultMessage: 'Trip details',
    description: 'Trip details',
  },
  noThreadFound: {
    id: 'app.noThreadFound',
    defaultMessage: 'No thread found! If you think something went wrong, please refresh the page',
    description: 'View Message',
  },
  dashBoardHeader: {
    id: 'app.dashBoardHeader',
    defaultMessage: 'Welcome to',
    description: 'Dashboard',
  },
  dashBoardInfo: {
    id: 'app.dashBoardInfo',
    defaultMessage: 'Check your messages, view upcoming trip information, and find travel inspiration all from your dashboard. Before booking your first ride, make sure upload a photo and write a short bio to help car owners get to know about you.',
    description: 'Dashboard',
  },
  allMessages: {
    id: 'app.allMessages',
    defaultMessage: 'All Messages',
    description: 'Dashboard',
  },
  hi: {
    id: 'app.hi',
    defaultMessage: 'Hi',
    description: 'Hi',
  },
  letYouGetReady: {
    id: 'app.letYouGetReady',
    defaultMessage: 'Let\'s get your car ready to be listed!',
    description: 'Let You Get Ready',
  },
  whatKindOfPlace: {
    id: 'app.whatKindOfPlace',
    defaultMessage: 'Car type',
    description: 'What Kind Of Place',
  },
  whatKindOfPlaceListing: {
    id: 'app.whatKindOfPlaceListing',
    defaultMessage: 'What kind of car, are you listing?',
    description: 'What Kind Of Place Listing',
  },
  whatGuestHave: {
    id: 'app.whatGuestHave',
    defaultMessage: 'Car type',
    description: 'What will guests have',
  },
  skip: {
    id: 'app.skip',
    defaultMessage: 'Skip now',
    description: 'Skip Button',
  },
  howManyGuests: {
    id: 'app.howManyGuests',
    defaultMessage: 'How many renters can your place accommodate?',
    description: 'How many renters can your place accommodate?',
  },
  howManyBeds: {
    id: 'app.howManyBeds',
    defaultMessage: 'How many beds can renters use?',
    description: 'How many beds can renters use?',
  },
  howManyBedrooms: {
    id: 'app.howManyBedrooms',
    defaultMessage: 'How many bedrooms can renters use?',
    description: 'How many bedrooms can renters use?',
  },
  howManyGuestsStay: {
    id: 'app.howManyGuestsStay',
    defaultMessage: 'How many renters can stay?',
    description: 'How many renters can stay?',
  },
  howManyBathrooms: {
    id: 'app.howManyBathrooms',
    defaultMessage: 'How many bathrooms?',
    description: 'How many bathrooms?',
  },
  whereLocated: {
    id: 'app.whereLocated',
    defaultMessage: 'Where’s your place located?',
    description: 'Where’s your place located?',
  },
  street: {
    id: 'app.street',
    defaultMessage: 'Street Address',
    description: 'Street Address',
  },
  buildingName: {
    id: 'app.buildingName',
    defaultMessage: 'Apt, Suite, Bldg. (optional)',
    description: 'Building Name',
  },
  zipcode: {
    id: 'app.zipcode',
    defaultMessage: 'Postal code',
    description: 'ZIP Code',
  },
  somethingWentWrong: {
    id: 'app.somethingWentWrong',
    defaultMessage: 'Sorry, something went wrong. Please try again',
    description: 'Wrong went wrong',
  },
  notLoggedIn: {
    id: 'app.notLoggedIn',
    defaultMessage: 'You are not logged In. Please log in to continue!',
    description: 'Wrong went wrong',
  },
  adminLoggedIn: {
    id: 'app.adminLoggedIn',
    defaultMessage: 'You are logged in as admin, you can\'t perform this action!',
    description: 'adminLoggedIn',
  },
  whatamenities: {
    id: 'app.whatamenities',
    defaultMessage: 'What features does your car offer?',
    description: 'Amenities Headline',
  },
  step2Heading: {
    id: 'app.step2Heading',
    defaultMessage: 'Step #2',
    description: 'STEP 2 Heading',
  },
  step3Heading: {
    id: 'app.step3Heading',
    defaultMessage: 'Step #3',
    description: 'STEP 3 Heading',
  },
  step1SubHeading: {
    id: 'app.step1SubHeading',
    defaultMessage: 'Describe your car',
    description: 'STEP 1 Sub Heading',
  },
  step2SubHeading: {
    id: 'app.step2SubHeading',
    defaultMessage: 'More details about your car',
    description: 'STEP 2 Sub Heading',
  },
  step3SubHeading: {
    id: 'app.step3SubHeading',
    defaultMessage: 'Get ready for renters',
    description: 'STEP 3 Sub Heading',
  },
  step1HeadingContent: {
    id: 'app.step1HeadingContent',
    defaultMessage: 'Car details, car features & more',
    description: 'STEP 1 Heading Content',
  },
  step2HeadingContent: {
    id: 'app.step2HeadingContent',
    defaultMessage: 'Photos, title, short description',
    description: 'STEP 2 Heading Content',
  },
  step3HeadingContent: {
    id: 'app.step3HeadingContent',
    defaultMessage: 'Booking Details, Calendar, Price & more',
    description: 'STEP 3 Heading Content',
  },
  mapWarning: {
    id: 'app.mapWarning',
    defaultMessage: 'Drag the pin to set your location.',
    description: 'Map Warning',
  },
  mapSuccess: {
    id: 'app.mapSuccess',
    defaultMessage: 'Great thank you!',
    description: 'Map Success',
  },
  photos: {
    id: 'app.photos',
    defaultMessage: 'Photos',
    description: 'Photos',
  },
  guestRequirementsTitle: {
    id: 'app.guestRequirementsTitle',
    defaultMessage: 'Review renter requirements',
    description: 'Guest Requirements Title',
  },
  setHouseRules: {
    id: 'app.setHouseRules',
    defaultMessage: 'Set car rules for your renters!',
    description: 'House Rules',
  },
  reviewGuestBookDescription: {
    id: 'app.reviewGuestBookDescription',
    defaultMessage: 'Renters can book available days instantly as long as they:',
    description: 'Guests can book available',
  },
  reviewGuestBookNote: {
    id: 'app.reviewGuestBookNote',
    defaultMessage: 'Renters who don’t meet your requirements must send a reservation request.',
    description: 'Review Guests Note',
  },
  calendar: {
    id: 'app.calendar',
    defaultMessage: 'Update your calendar',
    description: 'calendar title',
  },
  pricingDescription: {
    id: 'app.pricingDescription',
    defaultMessage: 'Your base price is your default daily and hourly rate.',
    description: 'pricing description',
  },
  basePrice: {
    id: 'app.basePrice',
    defaultMessage: 'Daily Base price',
    description: 'Base price',
  },
  dailyPricing: {
    id: 'app.dailyPricing',
    defaultMessage: 'Daily Hourly Pricing',
    description: 'Base Hourly Pricing',
  },
  basePriceLabel: {
    id: 'app.basePriceLabel',
    defaultMessage: 'Price per day',
    description: 'Base price Label',
  },
  basePriceLabel2: {
    id: 'app.basePriceLabel2',
    defaultMessage: 'Base Price ',
    description: ' Day price Label',
  },
  hourPriceLabel2: {
    id: 'app.hourPrice',
    defaultMessage: 'Price per Hour',
    description: '  Hourly price Label',
  },
  basePriceInvalid: {
    id: 'app.basePriceInvalid',
    defaultMessage: 'Invalid Base Price, only numbers(eg: 25) are allowed',
    description: 'Base price Invalid',
  },
  hourPriceInvalid: {
    id: 'app.hourPriceInvalid',
    defaultMessage: 'Invalid Hour Price, only numbers(eg: 25) are allowed',
    description: 'Hour price Invalid',
  },
  cleaningPriceInvalid: {
    id: 'app.cleaningPriceInvalid',
    defaultMessage: 'Invalid delivery price, only numbers(eg: 25) are allowed',
    description: 'Cleaning price Invalid',
  },
  currency: {
    id: 'app.currency',
    defaultMessage: 'Currency',
    description: 'Currency',
  },
  discountLabel: {
    id: 'app.discountLabel',
    defaultMessage: 'Enter number of days',
    description: 'Discount Label',
  },
  discountLabel1: {
    id: 'app.discountLabel1',
    defaultMessage: 'Weekly Discount',
    description: 'Weekly Discount',
  },
  discountWeekly: {
    id: 'app.discountWeekly',
    defaultMessage: 'Length of rent discount – hourly',
    description: 'Length of rent discount – hourly',
  },
  discountWeekly1: {
    id: 'app.discountWeekly1',
    defaultMessage: 'Discount Weekly',
    description: 'Discount Weekly',
  },
  discountInvalid: {
    id: 'app.discountInvalid',
    defaultMessage: 'Invalid discount. The discount must be between 0% and 99%.',
    description: 'Invalid discount',
  },
  discountMonthly: {
    id: 'app.discountMonthly',
    defaultMessage: 'Length of rent discount – daily',
    description: 'Length of rent discount – daily',
  },
  discountMonthly1: {
    id: 'app.discountMonthl1',
    defaultMessage: 'Discount Monthly',
    description: 'Discount Monthly',
  },
  localLaws: {
    id: 'app.localLaws',
    defaultMessage: 'Your local laws and taxes',
    description: 'Local Laws',
  },
  photosPlaceholder: {
    id: 'app.photosPlaceholder',
    defaultMessage: 'Click here to upload photos or drag them in',
    description: 'Photos Placeholder',
  },
  descriptionLabel: {
    id: 'app.descriptionLabel',
    defaultMessage: 'Describe the interior and exterior highlights of your car...',
    description: 'Description Placeholder',
  },
  instantBookingTitle: {
    id: 'app.instantBookingTitle',
    defaultMessage: 'Increase your earnings with instant book',
    description: 'Instant booking',
  },
  instantBookingInfo: {
    id: 'app.instantBookingInfo',
    defaultMessage: 'Instant Book can give your car an edge. Not only do renters prefer to book instantly, but we\'re promoting Instant Book listings in search results.',
    description: 'Instant booking',
  },
  whoCanBook: {
    id: 'app.whoCanBook',
    defaultMessage: 'Who can book instantly?',
    description: 'Instant booking',
  },
  whoCanBookInfo: {
    id: 'app.whoCanBookInfo',
    defaultMessage: 'Choose who can book available your days without requesting approval.',
    description: 'Instant booking',
  },
  whoCanBookInfo1: {
    id: 'app.whoCanBookInfo1',
    defaultMessage: 'Renters who meet your requirements and agree to your rules.',
    description: 'Instant booking',
  },
  whoCanBookInfo2: {
    id: 'app.whoCanBookInfo2',
    defaultMessage: 'Anyone else must send a reservation request.',
    description: 'Instant booking',
  },
  whoCanBookInfo3: {
    id: 'app.whoCanBookInfo3',
    defaultMessage: 'No one. All renters must send reservation requests.',
    description: 'Instant booking',
  },
  maxDaysTitle: {
    id: 'app.maxDaysTitle',
    defaultMessage: 'Booking Window',
    description: 'Booking Window',
  },
  datesDropDown: {
    id: 'app.datesDropDown',
    defaultMessage: 'Dates unavailable by default',
    description: 'Booking Dropdown',
  },
  datesOption1: {
    id: 'app.datesOption1',
    defaultMessage: '3 months into the future',
    description: 'Booking Dropdown',
  },
  datesOption2: {
    id: 'app.datesOption2',
    defaultMessage: '6 months into the future',
    description: 'Booking Dropdown',
  },
  datesOption3: {
    id: 'app.datesOption3',
    defaultMessage: '9 months into the future',
    description: 'Booking Dropdown',
  },
  datesOption4: {
    id: 'app.datesOption4',
    defaultMessage: '12 months into the future',
    description: 'Booking Dropdown',
  },
  datesOption5: {
    id: 'app.datesOption5',
    defaultMessage: 'All future dates',
    description: 'Booking Dropdown',
  },
  syncCalendars: {
    id: 'app.syncCalendars',
    defaultMessage: 'Sync calendars',
    description: 'Sync calendars',
  },
  tripLengthError1: {
    id: 'app.tripLengthError1',
    defaultMessage: 'Minimum days can\'t be higher than maximum days',
    description: 'Trip length',
  },
  tabPlaceType: {
    id: 'app.tabPlaceType',
    defaultMessage: 'Car Type',
    description: 'Tab bar',
  },
  tabTitle: {
    id: 'app.tabTitle',
    defaultMessage: 'Title',
    description: 'Tab bar',
  },
  guestRequirements: {
    id: 'app.guestRequirements',
    defaultMessage: 'Renter requirements',
    description: 'Tab bar',
  },
  reviewGuestBook: {
    id: 'app.reviewGuestBook',
    defaultMessage: 'Review renter book',
    description: 'Tab bar',
  },
  bookingWindow: {
    id: 'app.bookingWindow',
    defaultMessage: 'Booking window',
    description: 'Tab bar',
  },
  tabCalendar: {
    id: 'app.tabCalendar',
    defaultMessage: 'Calendar',
    description: 'Tab bar',
  },
  tabPricing: {
    id: 'app.tabPricing',
    defaultMessage: 'Pricing',
    description: 'Tab bar',
  },
  tabDiscount: {
    id: 'app.tabDiscount',
    defaultMessage: 'Discount',
    description: 'Tab bar',
  },
  tabBooking: {
    id: 'app.tabBooking',
    defaultMessage: 'Booking',
    description: 'Tab bar',
  },
  tabLocalLaws: {
    id: 'app.tabLocalLaws',
    defaultMessage: 'Local laws',
    description: 'Tab bar',
  },
  readyToPublish: {
    id: 'app.readyToPublish',
    defaultMessage: 'Your car is ready to publish!',
    description: 'Listing inde',
  },
  publishNow: {
    id: 'app.publishNow',
    defaultMessage: 'Publish now',
    description: 'Listing index',
  },
  previewListing: {
    id: 'app.previewListing',
    defaultMessage: 'Preview',
    description: 'Listing index',
  },
  listingPublished: {
    id: 'app.listingPublished',
    defaultMessage: 'Your car is published!',
    description: 'Listing index',
  },
  unPublishNow: {
    id: 'app.unPublishNow',
    defaultMessage: 'Unpublish now',
    description: 'Listing index',
  },
  panelReservation: {
    id: 'app.panelReservation',
    defaultMessage: 'Reservations',
    description: 'Reservations',
  },
  panelManageReservation: {
    id: 'app.panelManageReservation',
    defaultMessage: 'Manage reservations',
    description: 'Manage reservations',
  },
  transactions: {
    id: 'app.transactions',
    defaultMessage: 'Transactions',
    description: 'Transactions',
  },
  notFoundTitle: {
    id: 'app.notFoundTitle',
    defaultMessage: 'Uh-oh!',
    description: 'Not Found',
  },
  notFoundSubTitle: {
    id: 'app.notFoundSubTitle',
    defaultMessage: 'We can\'t seem to find the page you\'re looking for!',
    description: 'Not Found',
  },
  errorCode: {
    id: 'app.errorCode',
    defaultMessage: 'Error code: 404',
    description: 'Not Found',
  },
  linksTitle: {
    id: 'app.linksTitle',
    defaultMessage: 'Here are some helpful links instead:',
    description: 'Not Found',
  },
  hostingOn: {
    id: 'app.hostingOn',
    defaultMessage: 'Hosting on',
    description: 'Not Found',
  },
  pageError: {
    id: 'app.pageError',
    defaultMessage: 'Error',
    description: 'Page Error',
  },
  pageErrorInfo: {
    id: 'app.pageErrorInfo',
    defaultMessage: 'Sorry, a critical error occurred on this page.',
    description: 'Page Error',
  },
  messageStatus2: {
    id: 'app.messageStatus2',
    defaultMessage: 'Pre approved',
    description: 'Message Status',
  },
  messageStatus3: {
    id: 'app.messageStatus3',
    defaultMessage: 'Declined',
    description: 'Message Status',
  },
  messageStatus4: {
    id: 'app.messageStatus4',
    defaultMessage: 'Approved',
    description: 'Message Status',
  },
  messageStatus5: {
    id: 'app.messageStatus5',
    defaultMessage: 'Pending',
    description: 'Message Status',
  },
  messageStatus6: {
    id: 'app.messageStatus6',
    defaultMessage: 'Cancelled by owner',
    description: 'Message Status',
  },
  messageStatus7: {
    id: 'app.messageStatus7',
    defaultMessage: 'Cancelled by renter',
    description: 'Message Status',
  },
  messageStatus8: {
    id: 'app.messageStatus8',
    defaultMessage: 'Approved',
    description: 'Message Status',
  },
  messageStatus9: {
    id: 'app.messageStatus9',
    defaultMessage: 'Expired',
    description: 'Message Status',
  },
  messageStatus10: {
    id: 'app.messageStatus10',
    defaultMessage: 'Request to book',
    description: 'Message Status',
  },
  panelHeader1: {
    id: 'app.panelHeader1',
    defaultMessage: 'In progress',
    description: 'Panel Header',
  },
  panelHeader2: {
    id: 'app.panelHeader2',
    defaultMessage: 'Completed',
    description: 'Panel Header',
  },
  messageStatus11: {
    id: 'app.messageStatus11',
    defaultMessage: 'Cancelled',
    description: 'Message Status',
  },
  messagesNew: {
    id: 'app.messagesNew',
    defaultMessage: 'New',
    description: 'New',
  },
  saveAndContinue: {
    id: 'app.saveAndContinue',
    defaultMessage: 'Save & Continue',
    description: 'Save & Continue',
  },
  saveAndExit: {
    id: 'app.saveAndExit',
    defaultMessage: 'Save & Exit',
    description: 'Save and Exit',
  },
  reservationCancel: {
    id: 'app.reservationCancel',
    defaultMessage: 'This reservation will be cancelled immediately.',
    description: 'Cancel your trip',
  },
  nonRefundable: {
    id: 'app.nonRefundable',
    defaultMessage: 'Non-Refundable',
    description: 'Cancel your trip',
  },
  refundable: {
    id: 'app.refundable',
    defaultMessage: 'Refundable',
    description: 'Cancel your trip',
  },
  refundCost: {
    id: 'app.refundCost',
    defaultMessage: 'You will be refunded the above cost.',
    description: 'Cancel your trip',
  },
  payoutCost: {
    id: 'app.payoutCost',
    defaultMessage: 'You won\'t be refund.',
    description: 'Cancel your trip',
  },
  keepReservation: {
    id: 'app.keepReservation',
    defaultMessage: 'Keep your reservation',
    description: 'Keep your reservation',
  },
  cancelYourReservation: {
    id: 'app.cancelYourReservation',
    defaultMessage: 'Cancel your reservation',
    description: 'Cancel your reservation',
  },
  earnings: {
    id: 'app.earnings',
    defaultMessage: 'Earnings',
    description: 'Earnings',
  },
  willBeRefund: {
    id: 'app.willBeRefund',
    defaultMessage: 'will be refunded the',
    description: 'will be refunded the',
  },
  reservationCost: {
    id: 'app.reservationCost',
    defaultMessage: 'reservation cost',
    description: 'Reservation cost',
  },
  cancelYourTrip: {
    id: 'app.cancelYourTrip',
    defaultMessage: 'Cancel your trip',
    description: 'Cancel your Trip',
  },
  consider: {
    id: 'app.consider',
    defaultMessage: 'Consider',
    description: 'Consider',
  },
  tripBeforeCanceling: {
    id: 'app.tripBeforeCanceling',
    defaultMessage: 'trip before cancelling',
    description: 'trip before cancelling',
  },
  cancellingInfo: {
    id: 'app.cancellingInfo',
    defaultMessage: 'Cancelling a renter\'s reservation can disrupt their plans and have serious implications on their trip.',
    description: 'Trip before canceling',
  },
  started: {
    id: 'app.started',
    defaultMessage: 'Started',
    description: 'Started',
  },
  startIn: {
    id: 'app.startIn',
    defaultMessage: 'Starts in',
    description: 'Starts in',
  },
  stayingFor: {
    id: 'app.stayingFor',
    defaultMessage: 'Riding for',
    description: 'Staying for',
  },
  propertyLocated: {
    id: 'app.propertyLocated',
    defaultMessage: 'car is located in',
    description: 'Property is located in',
  },
  responseFrom: {
    id: 'app.responseFrom',
    defaultMessage: 'Your response',
    description: 'Response from',
  },
  savingButton: {
    id: 'app.savingButton',
    defaultMessage: 'Saving',
    description: 'Saving Button',
  },
  night: {
    id: 'app.night',
    defaultMessage: 'day',
    description: 'Bill Details',
  },
  minimumStay: {
    id: 'app.minimumStay',
    defaultMessage: 'minimum trip',
    description: 'Minimum stay',
  },
  maximumNightStay: {
    id: 'app.maximumNightStay',
    defaultMessage: 'maximum trip',
    description: 'Maximum stay',
  },
  review: {
    id: 'app.review',
    defaultMessage: 'Review',
    description: 'Review',
  },
  verifications: {
    id: 'app.verifications',
    defaultMessage: 'Verifications',
    description: 'Verifications',
  },
  verification: {
    id: 'app.verification',
    defaultMessage: 'Verification',
    description: 'Verification',
  },
  monthlyDiscount: {
    id: 'app.monthlyDiscount',
    defaultMessage: 'monthly price discount',
    description: 'Monthly Discount',
  },
  weeklyDiscount: {
    id: 'app.weeklyDiscount',
    defaultMessage: 'weekly price discount',
    description: 'Weekly Discount',
  },
  flexibleCheckIn: {
    id: 'app.flexibleCheckIn',
    defaultMessage: 'Flexible check in time',
    description: 'Flexible check in time',
  },
  howManyday: {
    id: 'app.howManyday',
    defaultMessage: 'day',
    description: 'day',
  },
  howManydays: {
    id: 'app.howManydays',
    defaultMessage: 'days',
    description: 'days',
  },
  your: {
    id: 'app.your',
    defaultMessage: 'Your',
    description: 'Your',
  },
  chooseCancellationPolicy: {
    id: 'app.chooseCancellationPolicy',
    defaultMessage: 'Cancellation policy',
    description: 'Cancellation Policy',
  },
  pendingPayouts: {
    id: 'app.pendingPayouts',
    defaultMessage: 'Pending payouts',
    description: 'Pending Payouts',
  },
  allPayoutMethod: {
    id: 'app.allPayoutMethod',
    defaultMessage: 'All payout methods',
    description: 'All payout methods',
  },
  inboxCompleted: {
    id: 'app.inboxCompleted',
    defaultMessage: 'Completed',
    description: 'Message Status - Inbox Item',
  },
  loginConfirmation: {
    id: 'app.loginConfirmation',
    defaultMessage: 'Sorry, you must log in to confirm your email. Please log in and try clicking the link from your email again!',
    description: 'Login confirmation',
  },
  upcomingReservations: {
    id: 'app.upcomingReservations',
    defaultMessage: 'Upcoming reservations',
    description: 'Upcoming reservations',
  },
  previousReservations: {
    id: 'app.previousReservations',
    defaultMessage: 'Previous reservations',
    description: 'Previous reservations',
  },
  upcomingTrips: {
    id: 'app.upcomingTrips',
    defaultMessage: 'Upcoming trips',
    description: 'Upcoming trips',
  },
  previousTrips: {
    id: 'app.previousTrips',
    defaultMessage: 'Previous trips',
    description: 'Previous trips',
  },
  noUpcomingReservation: {
    id: 'app.noUpcomingReservation',
    defaultMessage: 'When you have upcoming reservations, you\'ll see them here.',
    description: 'noUpcomingReservation',
  },
  noPreviousReservation: {
    id: 'app.noPreviousReservation',
    defaultMessage: 'When you have previous reservations, you\'ll see them here.',
    description: 'noPreviousReservation',
  },
  payNow: {
    id: 'app.paynow',
    defaultMessage: 'Pay now',
    description: 'Pay now',
  },
  creditCard: {
    id: 'app.creditCard',
    defaultMessage: 'Debit / Credit card',
    description: 'Debit / Credit card',
  },
  payPal: {
    id: 'app.payPal',
    defaultMessage: 'PayPal',
    description: 'payPal',
  },
  cvv: {
    id: 'app.cvv',
    defaultMessage: 'CVV',
    description: 'cvv',
  },
  expiryYear: {
    id: 'app.expiryYear',
    defaultMessage: 'Year',
    description: 'expiryYear',
  },
  cardExpires: {
    id: 'app.Expires',
    defaultMessage: 'Expiry',
    description: 'Expires',
  },
  required: {
    id: 'app.required',
    defaultMessage: '*Required',
    description: '*Required',
  },
  invalid: {
    id: 'app.invalid',
    defaultMessage: '*Invalid',
    description: '*Invalid',
  },
  payoutFirstName: {
    id: 'app.payoutFirstName',
    defaultMessage: 'Account holder first name',
    description: 'payoutFirstName',
  },
  payoutLastName: {
    id: 'app.payoutLastName',
    defaultMessage: 'Account holder last name',
    description: 'payoutLastName',
  },
  payoutRouting: {
    id: 'app.payoutRouting',
    defaultMessage: 'Routing number',
    description: 'payoutRouting',
  },
  accountNumber: {
    id: 'app.accountNumber',
    defaultMessage: 'Account number',
    description: 'accountNumber',
  },
  confirmAccountNumber: {
    id: 'app.confirmAccountNumber',
    defaultMessage: 'Confirm account number',
    description: 'confirmAccountNumber',
  },
  ssn4Digits: {
    id: 'app.ssn4Digits',
    defaultMessage: 'SSN last 4 digits',
    description: 'ssn4Digits',
  },
  payoutRoutingInvalid: {
    id: 'app.payoutRoutingInvalid',
    defaultMessage: 'Invalid routing number',
    description: 'payoutRoutingInvalid',
  },
  accountNumberInvalid: {
    id: 'app.accountNumberInvalid',
    defaultMessage: 'Invalid account number',
    description: 'accountNumberInvalid',
  },
  confirmAccountNumberInvalid: {
    id: 'app.confirmAccountNumberInvalid',
    defaultMessage: 'Invalid confirm account number',
    description: 'confirmAccountNumberInvalid',
  },
  confirmAccountNumberMismatch: {
    id: 'app.confirmAccountNumberMismatch',
    defaultMessage: 'Account number mismatch',
    description: 'confirmAccountNumberMismatch',
  },
  ssn4DigitsInvalid: {
    id: 'app.ssn4DigitsInvalid',
    defaultMessage: 'Invalid SSN number',
    description: 'ssn4DigitsInvalid',
  },
  verifiedBy: {
    id: 'app.verifiedBy',
    defaultMessage: 'Verified By',
    description: 'verifiedBy',
  },
  saved: {
    id: 'app.saved',
    defaultMessage: 'Saved',
    description: 'saved',
  },
  wishList: {
    id: 'app.wishList',
    defaultMessage: 'Wishlist',
    description: 'wishList',
  },
  wishLists: {
    id: 'app.wishLists',
    defaultMessage: 'Wishlists',
    description: 'wishLists',
  },
  createWishList: {
    id: 'app.createWishList',
    defaultMessage: 'Create a new wishlist',
    description: 'createWishList',
  },
  yourLists: {
    id: 'app.yourLists',
    defaultMessage: 'Your Cars',
    description: 'yourLists',
  },
  wishListAdded: {
    id: 'app.wishListAdded',
    defaultMessage: 'Wishlist added successfully.',
    description: 'Wish list added',
  },
  wishListUpdated: {
    id: 'app.wishListUpdated',
    defaultMessage: 'Wishlist updated successfully.',
    description: 'Wish list updated',
  },
  editWishList: {
    id: 'app.editWishList',
    defaultMessage: 'Edit wishlist',
    description: 'editWishList',
  },
  deleteWishList: {
    id: 'app.deleteWishList',
    defaultMessage: 'Delete wishlist',
    description: 'deleteWishList',
  },
  noWishlists: {
    id: 'app.noWishlists',
    defaultMessage: 'As you search, tap the Heart icon to save your favorite cars to say or things to do to a wishlist',
    description: 'noWishlists',
  },
  goToAllLists: {
    id: 'app.goToAllLists',
    defaultMessage: 'Go to all cars',
    description: 'Go to all cars',
  },
  noWishlistsHomes: {
    id: 'app.noWishlistsHomes',
    defaultMessage: 'Sorry, You don\'t have any wishlist cars!',
    description: 'noWishlistsHomes',
  },
  areYouSureDeleteWishList: {
    id: 'app.areYouSureDeleteWishList',
    defaultMessage: 'Are you sure you want to delete this?',
    description: 'areYouSureDeleteWishList',
  },
  confirmDelete: {
    id: 'app.confirmDelete',
    defaultMessage: 'Confirm delete',
    description: 'confirmDelete',
  },
  similarListings: {
    id: 'app.similarListings',
    defaultMessage: 'Similar cars',
    description: 'similarListings',
  },
  overview: {
    id: 'app.overview',
    defaultMessage: 'Overview',
    description: 'Overview',
  },
  theHost: {
    id: 'app.theHost',
    defaultMessage: 'The Owner',
    description: 'The Host',
  },
  documentverificaiton: {
    id: 'app.documentverificaiton',
    defaultMessage: 'Document verification',
    description: 'documentverificaiton',
  },
  documentverified: {
    id: 'app.documentverified',
    defaultMessage: 'Documents confirmed',
    description: 'documentverified',
  },
  documentverificaitonDetails: {
    id: 'app.documentverificaitonDetails',
    defaultMessage: 'Your documents have been verified.',
    description: 'documentverificaitonDetails',
  },
  documentReject: {
    id: 'app.documentReject',
    defaultMessage: 'Reject',
    description: 'documentReject',
  },
  documentUploadPlaceholder: {
    id: 'app.documentUploadPlaceholder',
    defaultMessage: 'Click here to upload document or drag them in',
    description: 'Document Upload Placeholder',
  },
  documentVerificaitonInfo: {
    id: 'app.documentVerificaitonInfo',
    defaultMessage: 'Please upload your documents for ID verification. Eg: Passport, Driving License.',
    description: 'Document Verification Info',
  },
  searchAsIMove: {
    id: 'app.searchAsIMove',
    defaultMessage: 'Search as I move the map',
    description: 'Search as I move the map',
  },
  contactMessage: {
    id: 'app.contactMessage',
    defaultMessage: 'Message',
    description: 'ContactMessage',
  },
  contactForm: {
    id: 'app.contactForm',
    defaultMessage: 'Contact us',
    description: 'contactForm',
  },
  nameInContact: {
    id: 'app.nameInContact',
    defaultMessage: 'Name',
    description: 'Nameincontact',
  },
  sendmail: {
    id: 'app.sendmail',
    defaultMessage: 'Send',
    description: 'Send',
  },
  nameYourList: {
    id: 'app.nameYourList',
    defaultMessage: 'Name your car',
    description: 'List Name',
  },
  flexibleCheckOut: {
    id: 'app.flexibleCheckOut',
    defaultMessage: 'Flexible check out time',
    description: 'Flexible check out time',
  },
  anonymousMessage: {
    id: 'app.anonymousMessage',
    defaultMessage: 'Do you want to report this User?',
    description: 'Report User',
  },
  reportUserInfo: {
    id: 'app.reportUserInfo',
    defaultMessage: 'If so, please choose one of the following reasons.',
    description: 'Report User',
  },
  reportContent1: {
    id: 'app.reportContent1',
    defaultMessage: 'This profile should not be on',
    description: 'Report User',
  },
  reportContent2: {
    id: 'app.reportContent2',
    defaultMessage: 'Attempt to share contact information',
    description: 'Report User',
  },
  close: {
    id: 'app.close',
    defaultMessage: 'Close',
    description: 'Report User',
  },
  reportContent3: {
    id: 'app.reportContent3',
    defaultMessage: 'Inappropriate content of spam',
    description: 'Report User',
  },
  thankyouInfo1: {
    id: 'app.thankyouInfo1',
    defaultMessage: 'Thanks for taking the time to report this user. These reports help make better for everyone, so we take them seriously. We will reach out if we have questions about your report.',
    description: 'Report User',
  },
  thankyouTitle: {
    id: 'app.thankyouTitle',
    defaultMessage: 'Thank you',
    description: 'Report User',
  },
  messageHistroyLabel: {
    id: 'app.messageHistroyLabel',
    defaultMessage: 'View',
    description: 'Report User',
  },
  titleRequiredLabel: {
    id: 'app.titleRequiredLabel',
    defaultMessage: 'Message History',
    description: 'Report User',
  },
  footerTerms: {
    id: 'app.footerTerms',
    defaultMessage: 'Terms, Privacy, Currency & More',
    description: 'Footer Button',
  },
  footerClose: {
    id: 'app.footerClose',
    defaultMessage: 'Close',
    description: 'Footer Button',
  },
  clear: {
    id: 'app.clear',
    defaultMessage: 'Clear',
    description: 'clear',
  },
  apply: {
    id: 'app.apply',
    defaultMessage: 'Apply',
    description: 'apply',
  },
  price: {
    id: 'app.price',
    defaultMessage: 'Price',
    description: 'price',
  },
  moreFilters: {
    id: 'app.moreFilters',
    defaultMessage: 'More filters',
    description: 'moreFilters',
  },
  showMore: {
    id: 'app.showMore',
    defaultMessage: 'Show more',
    description: 'Toggle Button',
  },
  showLess: {
    id: 'app.showLess',
    defaultMessage: 'Show less',
    description: 'Toggle Button',
  },
  showAll: {
    id: 'app.showAll',
    defaultMessage: 'Show all',
    description: 'Toggle Button',
  },
  bookNow: {
    id: 'app.bookNow',
    defaultMessage: 'Book now',
    description: 'Booking button',
  },
  contactAdmin: {
    id: 'app.contactAdmin',
    defaultMessage: ' contact us.',
    description: 'Contact Admin',
  },
  roomsAndBeds: {
    id: 'app.roomsAndBeds',
    defaultMessage: 'Rooms and Beds',
    description: 'Rooms and Beds',
  },
  chooseACountry: {
    id: 'app.chooseACountry',
    defaultMessage: 'Choose a country',
    description: 'Choose a country',
  },
  addPhoneNumber: {
    id: 'app.addPhoneNumber',
    defaultMessage: 'Add phone number',
    description: 'Add phone number',
  },
  addAPhoneNumber: {
    id: 'app.addAPhoneNumber',
    defaultMessage: 'Add a phone number',
    description: 'Add a phone number',
  },
  verifyViaSms: {
    id: 'app.verifyViaSms',
    defaultMessage: 'Verify via SMS',
    description: 'Verify via SMS',
  },
  mobileNumberRequired: {
    id: 'app.mobileNumberRequired',
    defaultMessage: 'Please enter a phone number.',
    description: 'Please enter a phone number.',
  },
  weHaveSentVerificationCode: {
    id: 'app.weHaveSentVerificationCode',
    defaultMessage: 'We sent a verification code to',
    description: 'We sent a verification code to',
  },
  verificationCodeLabel: {
    id: 'app.verificationCodeLabel',
    defaultMessage: 'Please enter the 4-digit code',
    description: 'Please enter the 4-digit code',
  },
  verificationCodeRequired: {
    id: 'app.verificationCodeRequired',
    defaultMessage: 'Please enter a verification code.',
    description: 'Please enter a verification code.',
  },
  listNotFoundTitle: {
    id: 'app.listNotFoundTitle',
    defaultMessage: 'It looks like this listing may deleted or unpublished.',
    description: 'Not Found',
  },
  cancelInfoBooking: {
    id: 'app.cancelInfoBooking',
    defaultMessage: 'Most owners respond within 24 hours.',
    description: 'View message',
  },
  cookiesDisclaimer: {
    id: 'app.cookiesDisclaimer',
    defaultMessage: 'uses cookies to understand how you use our site and to improve your experience. By using our site, you accept our use of cookies. To learn more, go to our',
    description: 'extraGuestIncluded'
  },
  gotIt: {
    id: 'app.gotIt',
    defaultMessage: 'GOT IT',
    description: ' cookies Disclaimer Button'
  },
  step1HeadingNew: {
    id: 'app.step1HeadingNew',
    defaultMessage: 'Step #1',
    description: 'STEP 2 Heading',
  },
  cookiePolicy: {
    id: 'app.cookiePolicy',
    defaultMessage: 'Cookie policy',
    description: ' cookies Disclaimer Link'
  },
  blockDates: {
    id: 'app.blockedDates',
    defaultMessage: 'Block',
    description: 'Listing Step3',
  },
  deSelect: {
    id: 'app.deSelect',
    defaultMessage: 'Cancel',
    description: 'Cancel deSelect button',
  },
  selectedDatesError: {
    id: 'app.selectedDatesError',
    defaultMessage: 'Something went wrong, please try again.',
    description: 'Something went wrong, please try again.'
  },
  selectedDates: {
    id: 'app.selectedDates',
    defaultMessage: 'Selected dates',
    description: 'Selected dates'
  },
  makeDateAvailable: {
    id: 'app.makeDateAvailable',
    defaultMessage: 'Special price',
    description: 'Listing Step3'
  },
  sessionPrice: {
    id: 'app.sessionPrice',
    defaultMessage: 'Special price',
    description: 'sessionPrice'
  },
  contactFormInformation: {
    id: 'app.contactFormInformation',
    defaultMessage: ' Contact & Support',
    description: 'contactForm',
  },
  contactFormEmail: {
    id: 'app.contactFormEmail',
    defaultMessage: 'Email Us',
    description: 'contactForm',
  },
  contactFormCall: {
    id: 'app.contactFormCall',
    defaultMessage: 'Call Us',
    description: 'contactForm',
  },
  contactFormAddress: {
    id: 'app.contactFormAddress',
    defaultMessage: 'Contact Address',
    description: 'Contact Address',
  },
  showDescription: {
    id: 'app.showDescription',
    defaultMessage: 'Show more',
    description: 'View Listing',
  },
  Youhadreviewsfor: {
    id: 'app.Youhadreviewsfor',
    defaultMessage: 'You reviewed',
    description: 'You reviewed',
  },
  sreview: {
    id: 'app.sreview',
    defaultMessage: 'reviewed',
    description: 's review',
  },
  carType: {
    id: 'app.carType',
    defaultMessage: 'Car type',
    description: 'Type of Room',
  },
  whatTypeOfProperty: {
    id: 'app.whatTypeOfProperty',
    defaultMessage: 'Make',
    description: 'What Type Of Property',
  },
  modelLabel: {
    id: 'app.modelLabel',
    defaultMessage: 'Model',
    description: 'Step 1',
  },
  year: {
    id: 'app.year',
    defaultMessage: 'Year',
    description: 'Year of birthday',
  },
  isPersonalHome: {
    id: 'app.isPersonalHome',
    defaultMessage: 'Transmission',
    description: 'Is this your personal home?',
  },
  odometer: {
    id: 'app.odometer',
    defaultMessage: 'Odometer',
    description: 'Step 1',
  },
  carFeatures: {
    id: 'app.carFeatures',
    defaultMessage: 'Car features',
    description: 'View listing Car features',
  },
  carPhotos: {
    id: 'app.carPhotos',
    defaultMessage: 'Upload your car photos',
    description: 'Upload car photos',
  },
  aboutCar: {
    id: 'app.aboutCar',
    defaultMessage: 'Description',
    description: 'About The Car',
  },
  carRules: {
    id: 'app.carRules',
    defaultMessage: 'Car rules',
    description: 'Car rules',
  },
  delivery: {
    id: 'app.delivery',
    defaultMessage: 'Doorstep delivery price',
    description: 'Payment details',
  },
  tripStart: {
    id: 'app.tripStart',
    defaultMessage: 'Start time',
    description: 'Trip start',
  },
  tripEnd: {
    id: 'app.tripEnd',
    defaultMessage: 'End time',
    description: 'Trip end',
  },
  listyourCar: {
    id: 'app.listyourCar',
    defaultMessage: 'Become an owner',
    description: 'List Your Car',
  },
  stepThreeRules: {
    id: 'app.stepThreeRules',
    defaultMessage: 'Let renters know your conditions before they book.',
    description: 'Let Renters know your conditions before they book.',
  },
  startLabel: {
    id: 'app.startLabel',
    defaultMessage: 'Trip time',
    description: 'Trip start',
  },
  automaticTransmission: {
    id: 'app.automaticTransmission',
    defaultMessage: 'Automatic transmission',
    description: 'Toggle Button',
  },
  vehicleCategory: {
    id: 'app.vehicleCategory',
    defaultMessage: 'Vehicle category',
    description: 'Become host side panel',
  },
  becomehostsidePanelOne: {
    id: 'app.becomehostsidePanelOne',
    defaultMessage: 'Car owners will manage the types of car brands in their settings.',
    description: 'Become host side panel',
  },
  becomehostsidePanelTwo: {
    id: 'app.becomehostsidePanelTwo',
    defaultMessage: 'Car owners will update the vehicle category from the dashboard.',
    description: 'Become host side panel',
  },
  becomehostsidePanelThree: {
    id: 'app.becomehostsidePanelThree',
    defaultMessage: 'Car owners can handle pricing setup for rentals.',
    description: 'Become host side panel',
  },
  ownersName: {
    id: 'app.ownersName',
    defaultMessage: 'Owner name',
    description: 'Odometer is Required',
  },
  licenseNumber: {
    id: 'app.licenseNumber',
    defaultMessage: 'License number',
    description: 'License Number',
  },
  liscenseInfo: {
    id: 'app.liscenseInfo',
    defaultMessage: 'About your license',
    description: 'Driver Info',
  },
  aboutLiscenseContent: {
    id: 'app.aboutLiscenseContent',
    defaultMessage: 'It\'s just a step away, let your car owner know about your driving proof.',
    description: 'Liscense Details',
  },
  car: {
    id: 'app.car',
    defaultMessage: 'Car',
    description: 'Car',
  },
  cars: {
    id: 'app.cars',
    defaultMessage: 'Cars',
    description: 'Cars',
  },
  chooseDifferentEndTime: {
    id: 'app.chooseDifferentEndTime',
    defaultMessage: 'You must choose different end time',
    description: 'You must choose different End time',
  },
  dob: {
    id: 'app.dob',
    defaultMessage: 'DOB',
    description: 'dob',
  },
  connectedGoogleInfo: {
    id: 'app.connectedGoogleInfo',
    defaultMessage: 'Your google account is connected',
    description: 'Google information',
  },
  payoutFailure: {
    id: 'app.payoutFailure',
    defaultMessage: 'Oops! We are sorry!',
    description: 'Uh-oh, the registration has failed.',
  },
  payoutFailureSubtitle: {
    id: 'app.payoutFailureSubtitle',
    defaultMessage: 'Connecting your bank account with the platform verification is failed.',
    description: 'Please add a valid SSN.'
  },
  payoutFailureContent: {
    id: 'app.payoutFailureContent',
    defaultMessage: 'Please try again to add your bank account with the platform by clickting the "Retry" option or Add a new payout account by clicking the "Add Payout Method".',
    description: 'Please add a valid SSN.'
  },
  paymentCardNumber: {
    id: 'app.paymentCardNumber',
    defaultMessage: 'Card number',
    description: 'cardNumber',
  },
  doorstepDelivery: {
    id: 'app.doorstepDelivery',
    defaultMessage: 'Include doorstep delivery',
    description: 'Include Doorstep Delivery',
  },
  deliveryCharges: {
    id: 'app.deliveryCharges',
    defaultMessage: 'Delivery Charges',
    description: 'cardNumber',
  },
  payoutType: {
    id: 'app.payoutType',
    defaultMessage: 'Account Type',
    description: 'payout Account Type',
  },
  payoutIndividual: {
    id: 'app.payoutIndividual',
    defaultMessage: 'Individual',
    description: 'Individual text',
  },
  payoutCompany: {
    id: 'app.payoutCompany',
    defaultMessage: 'Company',
    description: 'Company text',
  },
  payoutCompanyName: {
    id: 'app.payoutCompanyName',
    defaultMessage: 'Company Name',
    description: 'Company text',
  },
  payoutStripeInfo: {
    id: 'app.payoutStripeInfo',
    defaultMessage: 'We use Stripe to make sure you get paid on time and to keep your personal bank and details secure. Click "Finish" to set up your payments on Stripe.',
    description: 'Stripe text info'
  },
  notReady: {
    id: 'app.notReady',
    defaultMessage: 'Not ready',
    description: 'Payout Method',
  },
  payoutVerify: {
    id: 'app.payoutVerify',
    defaultMessage: 'Verify',
    description: 'Payout Method',
  },
  payoutRetry: {
    id: 'app.payoutRetry',
    defaultMessage: 'Retry',
    description: 'Payout Method',
  },
  averageRate: {
    id: 'app.averageRate',
    defaultMessage: 'Average rate per day for your trip.',
    description: 'Average rate',
  },
  allowOwner: {
    id: 'app.allowOwner',
    defaultMessage: 'The platform allows owners to choose among three standardized cancellation policies (flexible, moderate, and strict) that will be enforced to protect both renter and owner alike. Each listed car and its confirmed on our site will clearly state the cancellation policy. renters may cancel and review any penalties by viewing their travel plans and then clicking ‘cancel’ on the appropriate reservation.',
    description: 'Average rate',
  },
  Availablee: {
    id: 'app.Availablee',
    defaultMessage: 'Available',
    description: 'Average rate',
  },
  Blockk: {
    id: 'app.Blockk',
    defaultMessage: 'Block dates',
    description: 'Average rate',
  },
  localLaws1: {
    id: 'app.localLaws1',
    defaultMessage: 'Take a moment to review your local laws. We want to make sure you’ve got everything you need to get off to a great start.',
    description: 'Average rate',
  },
  localLaws2: {
    id: 'app.localLaws2',
    defaultMessage: 'Please educate yourself about the laws in your jurisdiction before listing your car.',
    description: 'Average rate',
  },
  localLaws3: {
    id: 'app.localLaws3',
    defaultMessage: 'Most cities have different rules and specific codes and ordinances in many places (such as zoning, building, licensing or tax codes). In most places, you must register, get a permit or obtain proper insurance and license before you list your car or before you accept renters. You may also be responsible for certain taxes.',
    description: 'Average rate',
  },
  localLaws4: {
    id: 'app.localLaws4',
    defaultMessage: 'Since you are responsible for your own decision to list your car or book, you should get comfortable with the applicable rules before listing on ',
    description: 'Average rate',
  },
  localLaws41: {
    id: 'app.localLaws41',
    defaultMessage: ' To get you started, we offer some helpful resources under "Your City Laws".',
    description: 'Average rate',
  },
  localLaws5: {
    id: 'app.localLaws5',
    defaultMessage: 'By accepting our Terms of Service and listing your car, you certify that you will follow applicable laws and regulations.',
    description: 'Average rate',
  },
  Automatic: {
    id: 'app.Automatic',
    defaultMessage: 'Automatic',
    description: 'Average rate',
  },
  Manuall: {
    id: 'app.Manuall',
    defaultMessage: 'Manual',
    description: 'Average rate',
  },
  siteNamee: {
    id: 'app.siteNamee',
    defaultMessage: 'Site Name',
    description: 'Average rate',
  },
  tryAgain: {
    id: 'app.tryAgain',
    defaultMessage: 'If it doesn\'t arrive, click cancel and try again.',
    description: 'Average rate',
  },
  Cancel: {
    id: 'app.Cancel',
    defaultMessage: 'Cancel',
    description: 'Average rate',
  },
  averageRate: {
    id: 'app.averageRate',
    defaultMessage: 'Average rate per day for your trip.',
    description: 'Average rate',
  },
  dateOnly: {
    id: 'app.dateOnly',
    defaultMessage: 'Dates',
    description: 'Average rate',
  },
  showMapp: {
    id: 'app.showMapp',
    defaultMessage: 'Show map',
    description: 'Average rate',
  },
  payoutVerifyStripeInfo: {
    id: 'app.payoutVerifyStripeInfo',
    defaultMessage: 'We use Stripe to make sure you get paid on time safe and secure. It requires additional verification to connect your bank account with the platform.',
    description: 'Payout Method',
  },
  available: {
    id: 'app.available',
    defaultMessage: ' Day',
    description: ' Day',
  },
  available2: {
    id: 'app.available2',
    defaultMessage: ' Hours',
    description: ' Hours',
  },
  importCalendar: {
    id: 'app.importCalendar',
    defaultMessage: 'Import calendar',
    description: 'Import Calendar',
  },
  exportCalendar: {
    id: 'app.exportCalendar',
    defaultMessage: 'Export calendar',
    description: 'Export Calendar',
  },
  notAvailable: {
    id: 'app.notAvailable',
    defaultMessage: 'Not available',
    description: 'Not Available',
  },
  booked: {
    id: 'app.booked',
    defaultMessage: 'Booked',
    description: 'Booked',
  },
  share: {
    id: 'app.share',
    defaultMessage: 'Share',
    description: 'Share',
  },
  copyLink: {
    id: 'app.copyLink',
    defaultMessage: 'Copy link',
    description: 'Copy Link',
  },
  linkCopied: {
    id: 'app.linkCopied',
    defaultMessage: 'Link Copied',
    description: 'Link Copied',
  },
  verified: {
    id: 'app.verified',
    defaultMessage: 'Verified',
    description: 'Verified',
  },
  bookingConfirmed: {
    id: 'app.bookingConfirmed',
    defaultMessage: 'Booking confirmed',
    description: 'Booking Confirmed',
  },
  exportCalendarlLabel: {
    id: 'app.exportCalendarlLabel',
    defaultMessage: 'Export calendar',
    description: 'Export Calendar',
  },
  exportCalendarlLabelDesc1: {
    id: 'app.exportCalendarlLabelDesc1',
    defaultMessage: 'Copy and paste the link into other ICAL applications',
    description: 'Export Calendar',
  },
  importCalendarlLabel: {
    id: 'app.importCalendarlLabel',
    defaultMessage: 'Import a new calendar',
    description: 'Import a New Calendar',
  },
  importCalendarlDesc1: {
    id: 'app.importCalendarlDesc1',
    defaultMessage: 'Import other calendars you use and we’ll automatically keep this listing’s availability up-to-date.',
    description: 'Import a New Calendar',
  },
  importCalendarlDesc2: {
    id: 'app.importCalendarlDesc2',
    defaultMessage: 'Calendar address (URL)',
    description: 'Import a New Calendar',
  },
  importCalendarlDesc3: {
    id: 'app.importCalendarlDesc3',
    defaultMessage: 'Name',
    description: 'Import a New Calendar',
  },
  importCalendarlDesc4: {
    id: 'app.importCalendarlDesc4',
    defaultMessage: 'Import calendar',
    description: 'Import a New Calendar',
  },
  youMustChooseTime: {
    id: 'app.youMustChooseTime',
    defaultMessage: 'You must choose different end time',
    description: 'You must choose different end time',
  },
  emailLabel: {
    id: 'app.emailLabel',
    defaultMessage: 'Email',
    description: 'Email',
  },
  chooseLanguage: {
    id: 'app.chooseLanguage',
    defaultMessage: 'Choose language',
    description: 'Choose a language',
  },
  chooseACurrency: {
    id: 'app.chooseACurrency',
    defaultMessage: 'Choose currency',
    description: 'Choose a Currency',
  },
  totalUsers: {
    id: 'app.totalUsers',
    defaultMessage: 'Total users',
    description: 'Total',
  },
  last24hoursUsers: {
    id: 'app.last24hoursUsers',
    defaultMessage: 'Last 24 hours',
    description: 'Last 24 hours',
  },
  last30daysUsers: {
    id: 'app.last30daysUsers',
    defaultMessage: 'Last 30 days',
    description: 'Last 30 days',
  },
  totalListings: {
    id: 'app.totalListings',
    defaultMessage: 'Total',
    description: 'Total listings',
  },
  last24hoursListings: {
    id: 'app.last24hoursListings',
    defaultMessage: 'Last 24 hours',
    description: 'Last 24 hours',
  },
  last30daysListings: {
    id: 'app.last30daysListings',
    defaultMessage: 'Last 30 days',
    description: 'Last 30 days',
  },
  totalReservations: {
    id: 'app.totalReservations',
    defaultMessage: 'Total reservations',
    description: 'Total Reservations',
  },
  last24hoursReservations: {
    id: 'app.last24hoursReservations',
    defaultMessage: 'Last 24 hours',
    description: 'Last 24 hours',
  },
  last30daysReservations: {
    id: 'app.last30daysReservations',
    defaultMessage: 'Last 30 days',
    description: 'Last 30 days',
  },
  logoLabel: {
    id: 'app.logoLabel',
    defaultMessage: 'Logo',
    description: 'Logo',
  },
  HomelogoLabel: {
    id: 'app.HomelogoLabel',
    defaultMessage: 'Home page logo',
    description: 'Home page logo',
  },
  EmaillogoLabel: {
    id: 'app.EmaillogoLabel',
    defaultMessage: 'Email logo',
    description: 'Email logo',
  },
  exportDataIntoCSV: {
    id: 'app.exportDataIntoCSV',
    defaultMessage: 'Export data into CSV',
    description: 'Export data into CSV',
  },
  bioInfo: {
    id: 'app.bioInfo',
    defaultMessage: 'Bio info',
    description: 'Bio info',
  },
  reservationId: {
    id: 'app.reservationId',
    defaultMessage: 'ID',
    description: 'ID',
  },
  reservationStatus: {
    id: 'app.reservationStatus',
    defaultMessage: 'Reservation Status',
    description: 'Reservation Status',
  },
  cancelledLabel: {
    id: 'app.cancelledLabel',
    defaultMessage: 'Cancelled by',
    description: 'Cancelled by',
  },
  carNameLabel: {
    id: 'app.carNameLabel',
    defaultMessage: 'Car Name',
    description: 'Car Name',
  },
  deliveryFeeLabel: {
    id: 'app.deliveryFeeLabel',
    defaultMessage: 'Delivery Fee',
    description: 'Delivery Fee',
  },
  bookingType: {
    id: 'app.bookingType',
    defaultMessage: 'Booking Type',
    description: 'Booking Type',
  },
  listSettings: {
    id: 'app.listSettings',
    defaultMessage: 'List Settings',
    description: 'List Settings',
  },
  invalidPageUrl: {
    id: 'app.invalidPageUrl',
    defaultMessage: 'Invalid Page URL',
    description: 'Invalid Page URL',
  },
  pageLabel: {
    id: 'app.pageLabel',
    defaultMessage: '/page/',
    description: '/page/',
  },
  metaTitleLabel: {
    id: 'app.metaTitleLabel',
    defaultMessage: 'Meta Title',
    description: 'Meta Title'
  },
  metaDescriptionLabel: {
    id: 'app.metaDescriptionLabel',
    defaultMessage: 'Meta Description',
    description: 'Meta Description'
  },
  pageTitleLabel: {
    id: 'app.pageTitleLabel',
    defaultMessage: 'Page Title',
    description: 'Page Title'
  },
  pageUrl: {
    id: 'app.pageUrl',
    defaultMessage: 'Page URL',
    description: 'Page URL'
  },
  footerCategoryLabel: {
    id: 'app.footerCategoryLabel',
    defaultMessage: 'Footer Category',
    description: 'Footer Category',
  },
  ChooseFooterCategory: {
    id: 'app.ChooseFooterCategory',
    defaultMessage: 'Choose Footer Category',
    description: 'Choose Footer Category',
  },
  contentLabel: {
    id: 'app.contentLabel',
    defaultMessage: 'Content',
    description: 'Content',
  },
  imageLabel: {
    id: 'app.imageLabel',
    defaultMessage: 'Image',
    description: 'Image',
  },
  locationAddress: {
    id: 'app.locationAddress',
    defaultMessage: 'Location Address',
    description: 'Location Address',
  },
  logInLabel: {
    id: 'app.logInLabel',
    defaultMessage: 'Login',
    description: 'Log in',
  },
  adminlogInLabel: {
    id: 'app.adminlogInLabel',
    defaultMessage: 'Admin log in',
    description: 'Admin Login',
  },
  welcomeAdminLabel: {
    id: 'app.welcomeAdminLabel',
    defaultMessage: 'Welcome Admin!',
    description: 'Welcome Admin !!!',
  },
  GotoMainSite: {
    id: 'app.GotoMainSite',
    defaultMessage: 'Go to main site',
    description: 'Go to Main Site',
  },
  provideListId: {
    id: 'app.provideListId',
    defaultMessage: 'Enter car ID',
    description: 'Provide list ID',
  },
  onlyNumericKey: {
    id: 'app.onlyNumericKey',
    defaultMessage: 'Only numeric values are allowed',
    description: 'Only numeric values are allowed',
  },
  carID: {
    id: 'app.carID',
    defaultMessage: 'ID',
    description: 'Car ID',
  },
  reviewContentLabel: {
    id: 'app.reviewContentLabel',
    defaultMessage: 'Review content',
    description: 'Review Content',
  },
  ratingReviewLabel: {
    id: 'app.ratingReviewLabel',
    defaultMessage: 'Review Rating',
    description: 'Review Rating',
  },
  editLabel: {
    id: 'app.editLabel',
    defaultMessage: 'Edit',
    description: 'Edit',
  },
  noRecordFound: {
    id: 'app.noRecordFound',
    defaultMessage: 'No matching records found.',
    description: 'No matching records found.',
  },
  homeBannerImage: {
    id: 'app.homeBannerImage',
    defaultMessage: 'Home Banner Image',
    description: 'Home Banner Image',
  },
  titleAdminLabel: {
    id: 'app.titleAdminLabel',
    defaultMessage: 'Title',
    description: 'Title',
  },
  idLabel: {
    id: 'app.idLabel',
    defaultMessage: 'ID',
    description: 'ID',
  },
  addPageLabel: {
    id: 'app.addPageLabel',
    defaultMessage: 'Add Page',
    description: 'Add Page',
  },
  passWordMismatch: {
    id: 'app.passWordMismatch',
    defaultMessage: 'Password is mismatching with Confirm password',
    description: 'Password is mismatching with Confirm password',
  },
  changeAdminPasswordDesc: {
    id: 'app.changeAdminPasswordDesc',
    defaultMessage: 'Leave email address field blank if you don\'t want to change the email',
    description: 'Leave email address field blank if you don\'t want to change the email',
  },
  symbolLabel: {
    id: 'app.symbolLabel',
    defaultMessage: 'Symbol',
    description: 'Symbol',
  },
  baseCurrencyLabel: {
    id: 'app.baseCurrencyLabel',
    defaultMessage: 'Base Currency',
    description: 'Base Currency',
  },
  setEnableDisable: {
    id: 'app.setEnableDisable',
    defaultMessage: 'Set Enable / Disable',
    description: 'Set Enable / Disable',
  },
  setCurrencyLabel: {
    id: 'app.setCurrencyLabel',
    defaultMessage: 'Set Base Currency',
    description: 'Set Base Currency',
  },
  addLabel: {
    id: 'app.addLabel',
    defaultMessage: 'Add',
    description: 'Add',
  },
  setBaseCurrency: {
    id: 'app.setBaseCurrency',
    defaultMessage: 'Set as base currency',
    description: 'Set as base currency',
  },
  enabledLabel: {
    id: 'app.enabledLabel',
    defaultMessage: 'Enabled',
    description: 'Enabled',
  },
  disabledLabel: {
    id: 'app.disabledLabel',
    defaultMessage: 'Disabled',
    description: 'Disabled',
  },
  enableLabel: {
    id: 'app.enableLabel',
    defaultMessage: 'Enable',
    description: 'Enable',
  },
  disableLabel: {
    id: 'app.disableLabel',
    defaultMessage: 'Disable',
    description: 'Disable',
  },
  allowedPaymentCurrency: {
    id: 'app.allowedPaymentCurrency',
    defaultMessage: 'Allowed Payment Currency',
    description: 'Allowed Payment Currency',
  },
  ownerNameLabel: {
    id: 'app.ownerNameLabel',
    defaultMessage: 'Owner Name',
    description: 'Owner Name',
  },
  ownerEmailLabel: {
    id: 'app.ownerEmailLabel',
    defaultMessage: 'Owner Email',
    description: 'Owner Email',
  },
  requestedFiles: {
    id: 'app.requestedFiles',
    defaultMessage: 'Requested Files',
    description: 'Requested Files',
  },
  actionLabel: {
    id: 'app.actionLabel',
    defaultMessage: 'Action',
    description: 'Action',
  },
  sNotoId: {
    id: 'app.sNotoId',
    defaultMessage: 'ID',
    description: 'ID',
  },
  adminBannerImage: {
    id: 'app.adminBannerImage',
    defaultMessage: 'Banner Image',
    description: 'Banner Image',
  },
  adminDescriptionLabel: {
    id: 'app.adminDescriptionLabel',
    defaultMessage: 'Description',
    description: 'Description',
  },
  buttonLabel: {
    id: 'app.buttonLabel',
    defaultMessage: 'Button label',
    description: 'Button label',
  },
  carOwnerName: {
    id: 'app.carOwnerName',
    defaultMessage: 'Car Owner Name',
    description: 'Car Owner Name',
  },
  carOwnerEmail: {
    id: 'app.carOwnerEmail',
    defaultMessage: 'Car Owner Email',
    description: 'Car Owner Email',
  },
  createdDate: {
    id: 'app.createdDate',
    defaultMessage: 'Created at',
    description: 'Created Date',
  },
  stateLabel: {
    id: 'app.stateLabel',
    defaultMessage: 'State',
    description: 'State',
  },
  recommendLabel: {
    id: 'app.recommendLabel',
    defaultMessage: 'Recommend',
    description: 'Recommend',
  },
  setLabel: {
    id: 'app.setLabel',
    defaultMessage: 'Set',
    description: 'Set',
  },
  publishedLabel: {
    id: 'app.publishedLabel',
    defaultMessage: 'Published',
    description: 'Published',
  },
  viewLabel: {
    id: 'app.viewLabel',
    defaultMessage: 'View',
    description: 'View',
  },
  adminTitleLabel: {
    id: 'app.adminTitleLabel',
    defaultMessage: 'Title',
    description: 'Title',
  },
  addNew: {
    id: 'app.addNew',
    defaultMessage: 'Item name',
    description: 'Item name',
  },
  addNewDescription: {
    id: 'app.addNewDescription',
    defaultMessage: 'Item description',
    description: 'Item description',
  },
  addOtherItem: {
    id: 'app.addOtherItem',
    defaultMessage: 'Other Item name',
    description: 'Other Item name',
  },
  startValue: {
    id: 'app.startValue',
    defaultMessage: 'Start value',
    description: 'Start value',
  },
  endValue: {
    id: 'app.endValue',
    defaultMessage: 'End value',
    description: 'Add end value here ....',
  },
  startValueIsInvalid: {
    id: 'app.startValueIsInvalid',
    defaultMessage: 'Invalid Start value, provide a valid number',
    description: 'startValueIsInvalid',
  },
  endValueIsInvalid: {
    id: 'app.endValueIsInvalid',
    defaultMessage: 'Invalid End value, provide a valid number',
    description: 'endValueIsInvalid',
  },
  endValueGreater: {
    id: 'app.endValueGreater',
    defaultMessage: 'End value must be greater than Start value',
    description: 'endValueGreater',
  },
  makeLabel: {
    id: 'app.makeLabel',
    defaultMessage: 'Make',
    description: 'Make',
  },
  update: {
    id: 'ListSettingsForm.update',
    defaultMessage: 'Update',
    description: 'Update Button',
  },
  addNewLabel: {
    id: 'app.addNewLabel',
    defaultMessage: 'Add new',
    description: 'Add new',
  },
  settingsIDLabel: {
    id: 'app.settingsIDLabel',
    defaultMessage: 'ID',
    description: 'Settings ID',
  },
  operationLabel: {
    id: 'app.operationLabel',
    defaultMessage: 'Operation',
    description: 'Operation',
  },
  manageLabel: {
    id: 'app.manageLabel',
    defaultMessage: 'Manage',
    description: 'Manage',
  },
  carSettings: {
    id: 'app.carSettings',
    defaultMessage: 'Car Settings',
    description: 'Car Settings',
  },
  paymentGateway: {
    id: 'app.paymentGateway',
    defaultMessage: 'Payment Gateway',
    description: 'Payment Gateway',
  },
  activeLabel: {
    id: 'app.activeLabel',
    defaultMessage: 'Active',
    description: 'Active',
  },
  inActiveLabel: {
    id: 'app.inActiveLabel',
    defaultMessage: 'Inactive',
    description: 'Inactive',
  },
  payoutsLabel: {
    id: 'app.payoutsLabel',
    defaultMessage: 'Payouts',
    description: 'Payouts',
  },
  dataMissing: {
    id: 'app.dataMissing',
    defaultMessage: 'List is missing',
    description: 'List is missing',
  },
  payoutLabel: {
    id: 'app.payoutLabel',
    defaultMessage: 'Payout Amount',
    description: 'Payout Amount',
  },
  payoutStatus: {
    id: 'app.payoutStatus',
    defaultMessage: 'Payout Status',
    description: 'Payout Status',
  },
  holdPayout: {
    id: 'app.holdPayout',
    defaultMessage: 'Hold Payout',
    description: 'Hold Payout',
  },
  yesLabel: {
    id: 'app.yesLabel',
    defaultMessage: 'Yes',
    description: 'Yes',
  },
  noLabel: {
    id: 'app.noLabel',
    defaultMessage: 'No',
    description: 'No',
  },
  adminListTitle: {
    id: 'app.adminListTitle',
    defaultMessage: 'List Title',
    description: 'List Title',
  },
  codeLabel: {
    id: 'app.codeLabel',
    defaultMessage: 'Code',
    description: 'Code',
  },
  addPopularLocation: {
    id: 'app.addPopularLocation',
    defaultMessage: 'Add Popular Location',
    description: 'Add Popular Location',
  },
  reporterName: {
    id: 'app.reporterName',
    defaultMessage: 'Reporter Name',
    description: 'Reporter Name',
  },
  reporterEmail: {
    id: 'app.reporterEmail',
    defaultMessage: 'Reporter email',
    description: 'Reporter Email',
  },
  userNameLabel: {
    id: 'app.userNameLabel',
    defaultMessage: 'User name',
    description: 'User Name',
  },
  userEmailLabel: {
    id: 'app.userEmailLabel',
    defaultMessage: 'User email',
    description: 'User Email',
  },
  userDeletedLabel: {
    id: 'app.userDeletedLabel',
    defaultMessage: 'User Deleted',
    description: 'User Deleted',
  },
  reportType: {
    id: 'app.reportType',
    defaultMessage: 'Report Type',
    description: 'Report Type',
  },
  dateLabel: {
    id: 'app.dateLabel',
    defaultMessage: 'Date',
    description: 'Date',
  },
  payoutRefund: {
    id: 'app.payoutRefund',
    defaultMessage: 'Payout/Refund',
    description: 'Payout/Refund',
  },
  noPayoutMethod: {
    id: 'app.noPayoutMethod',
    defaultMessage: 'No Payout method',
    description: 'No Payout method',
  },
  closedLabel: {
    id: 'app.closedLabel',
    defaultMessage: 'Closed',
    description: 'Closed',
  },
  processingLabel: {
    id: 'app.processingLabel',
    defaultMessage: 'Processing...',
    description: 'Processing...',
  },
  completedLabel: {
    id: 'app.completedLabel',
    defaultMessage: 'Completed',
    description: 'Completed',
  },
  transactionNotfound: {
    id: 'app.transactionNotfound',
    defaultMessage: 'Transaction not found',
    description: 'Transaction not found',
  },
  notEligible: {
    id: 'app.notEligible',
    defaultMessage: 'Not Eligible',
    description: 'Not Eligible',
  },
  proceedRefund: {
    id: 'app.proceedRefund',
    defaultMessage: 'Proceed Refund',
    description: 'Proceed Refund',
  },
  pleaseChooseCurreny: {
    id: 'app.pleaseChooseCurreny',
    defaultMessage: 'Please choose a currency',
    description: 'Please choose a currency',
  },
  receiverLabel: {
    id: 'app.receiverLabel',
    defaultMessage: 'Receiver',
    description: 'Receiver',
  },
  carNameIsMissing: {
    id: 'app.carNameIsMissing',
    defaultMessage: 'Car name is missing',
    description: 'Car name is missing',
  },
  refundToRenter: {
    id: 'app.refundToRenter',
    defaultMessage: 'Refund to Renter',
    description: 'Refund to Renter',
  },
  subTotalLabel: {
    id: 'app.subTotalLabel',
    defaultMessage: 'Sub Total',
    description: 'Sub Total',
  },
  payoutLabelAdmin: {
    id: 'app.payoutLabelAdmin',
    defaultMessage: 'Payout',
    description: 'Payout',
  },
  minimumPrice: {
    id: 'app.minimumPrice',
    defaultMessage: 'Minimum price',
    description: 'Minimum price',
  },
  maximumPrice: {
    id: 'app.maximumPrice',
    defaultMessage: 'Maximum price',
    description: 'Maximum price',
  },
  priceRangeCurrency: {
    id: 'app.priceRangeCurrency',
    defaultMessage: 'Price range currency',
    description: 'Price range currency',
  },
  renterServiceFee: {
    id: 'app.renterServiceFee',
    defaultMessage: 'Renter Service Fee',
    description: 'Renter Service Fee',
  },
  fixedPrice: {
    id: 'app.fixedPrice',
    defaultMessage: 'Fixed price',
    description: 'Fixed Price',
  },
  percentage: {
    id: 'app.percentage',
    defaultMessage: 'Percentage',
    description: 'Percentage',
  },
  carOwnerServiceFee: {
    id: 'app.carOwnerServiceFee',
    defaultMessage: 'Car Owner Service Fee',
    description: 'Car Owner Service Fee',
  },
  provideFixedGuestFee: {
    id: 'app.provideFixedGuestFee',
    defaultMessage: 'Provide fixed amount or percentage for service fee',
    description: 'Provide fixed amount or percentage for service fee',
  },
  currencyRequiredLabel: {
    id: 'app.currencyRequiredLabel',
    defaultMessage: 'Currency is required when you use fixed price',
    description: 'Currency is required when you use fixed price',
  },
  choosePresentageValue: {
    id: 'app.choosePresentageValue',
    defaultMessage: 'Choose percentage value between 1 to 99',
    description: 'Choose percentage value between 1 to 99',
  },
  siteName: {
    id: 'app.siteName',
    defaultMessage: 'Site name',
    description: 'Site name',
  },
  siteTitle: {
    id: 'app.siteTitle',
    defaultMessage: 'Site title',
    description: 'Site title',
  },
  metaKeywordLabel: {
    id: 'app.metaKeywordLabel',
    defaultMessage: 'Meta keyword',
    description: 'Meta keyword',
  },
  metaKeywordLabelDesc: {
    id: 'app.metaKeywordLabelDesc',
    defaultMessage: 'Meta description',
    description: 'Meta description',
  },
  facebookURL: {
    id: 'app.facebookURL',
    defaultMessage: 'Facebook URL',
    description: 'Facebook URL',
  },
  twitterURL: {
    id: 'app.twitterURL',
    defaultMessage: 'Twitter URL',
    description: 'Twitter URL',
  },
  instagramURL: {
    id: 'app.instagramURL',
    defaultMessage: 'Instagram URL',
    description: 'Instagram URL',
  },
  homePageLayout: {
    id: 'app.homePageLayout',
    defaultMessage: 'Home page layout',
    description: 'Home page layout',
  },
  homePageLayoutDesc: {
    id: 'app.homePageLayoutDesc',
    defaultMessage: 'Banner Text with Image Slider Layout',
    description: 'Banner Text with Image Slider Layout',
  },
  homePageLayoutDesc1: {
    id: 'app.homePageLayoutDesc1',
    defaultMessage: 'Banner Text Only Layout',
    description: 'Banner Text Only Layout',
  },
  homePageLayoutDesc2: {
    id: 'app.homePageLayoutDesc2',
    defaultMessage: 'Banner Text Layout with Detailed Search form',
    description: 'Banner Text Layout with Detailed Search form',
  },
  homePageLayoutDesc3: {
    id: 'app.homePageLayoutDesc3',
    defaultMessage: 'Single Banner Image Layout with  Search Form',
    description: 'Single Banner Image Layout with  Search Form',
  },
  phoneNumberFormat: {
    id: 'app.phoneNumberFormat',
    defaultMessage: 'Phone number format',
    description: 'Phone number format',
  },
  twilioSMS: {
    id: 'app.twilioSMS',
    defaultMessage: 'Twilio SMS',
    description: 'Twilio SMS',
  },
  normalPhoneNumber: {
    id: 'app.normalPhoneNumber',
    defaultMessage: 'Normal Phone Number',
    description: 'Normal Phone Number',
  },
  appAvailable: {
    id: 'app.appAvailable',
    defaultMessage: 'App available',
    description: 'App available',
  },
  playStoreUrl: {
    id: 'app.playStoreUrl',
    defaultMessage: 'Play store URL',
    description: 'Play store URL',
  },
  appStoreUrl: {
    id: 'app.appStoreUrl',
    defaultMessage: 'App store URL',
    description: 'App store URL',
  },
  emailIdLabel: {
    id: 'app.emailIdLabel',
    defaultMessage: 'Email id',
    description: 'Email Id',
  },
  mobileNumberLabel: {
    id: 'app.mobileNumberLabel',
    defaultMessage: 'Mobile number',
    description: 'Mobile Number',
  },
  footerImageBlock: {
    id: 'app.footerImageBlock',
    defaultMessage: 'Footer Image Block',
    description: 'Footer Image Block',
  },
  headingLabel: {
    id: 'app.headingLabel',
    defaultMessage: 'Heading',
    description: 'Heading',
  },
  pageName: {
    id: 'app.pageName',
    defaultMessage: 'Page Name',
    description: 'Page Name',
  },
  aboutUsLabel: {
    id: 'app.aboutUsLabel',
    defaultMessage: 'About Us',
    description: 'About Us',
  },
  selectLabel: {
    id: 'app.selectLabel',
    defaultMessage: 'Select',
    description: 'Select',
  },
  banLabel: {
    id: 'app.banLabel',
    defaultMessage: 'Ban',
    description: 'Ban',
  },
  unBanLabel: {
    id: 'app.unBanLabel',
    defaultMessage: 'Permit',
    description: 'UnBan',
  },
  usersLabel: {
    id: 'app.usersLabel',
    defaultMessage: 'Users',
    description: 'Users',
  },
  reservationConfirmCode: {
    id: 'app.reservationConfirmCode',
    defaultMessage: 'Reservation Confirmation Code',
    description: 'Reservation Confirmation Code',
  },
  CheckInDate: {
    id: 'app.CheckInDate',
    defaultMessage: 'Check-in Date',
    description: 'Check-in Date',
  },
  CheckOutDate: {
    id: 'app.CheckOutDate',
    defaultMessage: 'Check-out Date',
    description: 'Check-out Date',
  },
  SenderLabel: {
    id: 'app.SenderLabel',
    defaultMessage: 'Sender',
    description: 'Sender',
  },
  reviewStatusLabel: {
    id: 'app.reviewStatusLabel',
    defaultMessage: 'Review Status',
    description: 'Review Status',
  },
  reviewActionLabel: {
    id: 'app.reviewActionLabel',
    defaultMessage: 'Review Action',
    description: 'Review Action',
  },
  setToEnable: {
    id: 'app.setToEnable',
    defaultMessage: 'Set to enable',
    description: 'Set to enable',
  },
  setToDisable: {
    id: 'app.setToDisable',
    defaultMessage: 'Set to disable',
    description: 'Set to disable',
  },
  listId: {
    id: 'app.listId',
    defaultMessage: 'ID',
    description: 'List ID',
  },
  reason: {
    id: 'app.reason',
    defaultMessage: 'Reason',
    description: 'Reason',
  },
  amountPaid: {
    id: 'app.amountPaid',
    defaultMessage: 'Amount Paid',
    description: 'Amount Paid',
  },
  renterName: {
    id: 'app.renterName',
    defaultMessage: 'Renter Name',
    description: 'Renter Name',
  },
  renterPhoneNumber: {
    id: 'app.renterPhoneNumber',
    defaultMessage: 'Renter Phone Number',
    description: 'Renter Phone Number',
  },
  renterEmail: {
    id: 'app.renterEmail',
    defaultMessage: 'Renter Email',
    description: 'Renter Email',
  },
  carOwnerPhoneNumber: {
    id: 'app.carOwnerPhoneNumber',
    defaultMessage: 'Car Owner Phone Number',
    description: 'Car Owner Phone Number',
  },
  cancelDate: {
    id: 'app.cancelDate',
    defaultMessage: 'Cancel Date',
    description: 'Cancel Date',
  },
  hostBannerTitle: {
    id: 'app.hostBannerTitle',
    defaultMessage: 'Owner Banner Title',
    description: 'Host Banner Title',
  },
  hostBannerContent: {
    id: 'app.hostBannerContent',
    defaultMessage: 'Owner banner Content',
    description: 'Host banner Content',
  },
  ownerBanner: {
    id: 'app.ownerBanner',
    defaultMessage: 'Owner banner image',
    description: 'Owner Banner',
  },
  earnBlockTitle: {
    id: 'app.earnBlockTitle',
    defaultMessage: 'Block title',
    description: 'Earn Block Title',
  },
  earnBlockContent: {
    id: 'app.earnBlockContent',
    defaultMessage: 'Block Content',
    description: 'Block Content',
  },
  whyBlockTitleLabel: {
    id: 'app.whyBlockTitleLabel',
    defaultMessage: 'Why block title',
    description: 'Why block title',
  },
  whyBlockTitleLabel1: {
    id: 'app.whyBlockTitleLabel1',
    defaultMessage: 'Why block title 1',
    description: 'Why block title 1',
  },
  whyBlockTitleLabel2: {
    id: 'app.whyBlockTitleLabel2',
    defaultMessage: 'Why block title 2',
    description: 'Why block title 2',
  },
  whyBlockContentLabel: {
    id: 'app.whyBlockContentLabel',
    defaultMessage: 'Why block content 1',
    description: 'Why block content 1',
  },
  whyBlockContentLabel2: {
    id: 'app.whyBlockContentLabel2',
    defaultMessage: 'Why block content 2',
    description: 'Why block content 2',
  },
  whyBlockContentLabel1: {
    id: 'app.whyBlockContentLabel1',
    defaultMessage: 'Why block content 1',
    description: 'Why block content 1',
  },
  easyHostTitle: {
    id: 'app.easyHostTitle',
    defaultMessage: 'Easy Owner title',
    description: 'Easy Owner title',
  },
  easyHostTitle1: {
    id: 'app.easyHostTitle1',
    defaultMessage: 'Owner title 1',
    description: 'Owner title 1',
  },
  workTitleHeading: {
    id: 'app.workTitleHeading',
    defaultMessage: 'Heading',
    description: 'Work Title Heading',
  },
  workTitleLabel1: {
    id: 'app.workTitleLabel1',
    defaultMessage: 'Work title 1',
    description: 'Work title 1',
  },
  workTitleLabel2: {
    id: 'app.workTitleLabel2',
    defaultMessage: 'Work title 2',
    description: 'Work title 2',
  },
  workTitleLabel3: {
    id: 'app.workTitleLabel3',
    defaultMessage: 'Work title3',
    description: 'Work title3',
  },
  workTitleContentLabel1: {
    id: 'app.workTitleContentLabel1',
    defaultMessage: 'Work Content 1',
    description: 'Work Content 1',
  },
  workTitleContentLabel2: {
    id: 'app.workTitleContentLabel2',
    defaultMessage: 'Work Content 2',
    description: 'Work Content 2',
  },
  workTitleContentLabel3: {
    id: 'app.workTitleContentLabel3',
    defaultMessage: 'Work Content 3',
    description: 'Work Content 3',
  },
  peaceTitleHeading: {
    id: 'app.peaceTitleHeading',
    defaultMessage: 'Heading',
    description: 'Peace Title Heading',
  },
  peaceTitleLabel1: {
    id: 'app.peaceTitleLabel1',
    defaultMessage: 'Peace title 1',
    description: 'Peace title 1',
  },
  peaceTitleLabel2: {
    id: 'app.peaceTitleLabel2',
    defaultMessage: 'Peace title 2',
    description: 'Peace title 2',
  },
  peaceContentLabel1: {
    id: 'app.peaceContentLabel1',
    defaultMessage: 'Peace Content 1',
    description: 'Peace Content 1',
  },
  peaceContentLabel2: {
    id: 'app.peaceContentLabel2',
    defaultMessage: 'Peace Content 2',
    description: 'Peace Content 2',
  },
  peaceContentLabel3: {
    id: 'app.peaceContentLabel3',
    defaultMessage: 'Content',
    description: 'Peace Content 3',
  },
  welcomeAdmin: {
    id: 'app.welcomeAdmin',
    defaultMessage: 'Welcome, Admin!',
    description: 'Welcome, Admin',
  },
  siteSettings: {
    id: 'app.siteSettings',
    defaultMessage: 'Site settings',
    description: 'Site settings',
  },
  manageUser: {
    id: 'app.manageUser',
    defaultMessage: 'Manage users',
    description: 'Manage Users',
  },
  manageReservations: {
    id: 'app.manageReservations',
    defaultMessage: 'Manage reservations',
    description: 'Manage Reservations',
  },
  reviewManagement: {
    id: 'app.reviewManagement',
    defaultMessage: 'Reviews management',
    description: 'Reviews Management',
  },
  adminReviews: {
    id: 'app.adminReviews',
    defaultMessage: 'Admin reviews',
    description: 'Admin Reviews',
  },
  adminManageReviews: {
    id: 'app.adminManageReviews',
    defaultMessage: 'Manage reviews',
    description: 'Manage reviews',
  },
  manageReviwes: {
    id: 'app.manageReviwes',
    defaultMessage: 'Manage reviews',
    description: 'Manage Reviews',
  },
  writeReviwes: {
    id: 'app.writeReviwes',
    defaultMessage: 'Write a review',
    description: 'Write Review',
  },
  editReviwes: {
    id: 'app.editReviwes',
    defaultMessage: 'Edit a review',
    description: 'Edit Review',
  },
  manageServiceFee: {
    id: 'app.manageServiceFee',
    defaultMessage: 'Manage service fee',
    description: 'Manage service fee',
  },
  reportManagement: {
    id: 'app.reportManagement',
    defaultMessage: 'Report management',
    description: 'Report Management',
  },
  manageCurrency: {
    id: 'app.manageCurrency',
    defaultMessage: 'Manage currency',
    description: 'Manage Currency',
  },
  payOutManagement: {
    id: 'app.payOutManagement',
    defaultMessage: 'Payout management',
    description: 'Payout Management',
  },
  managePaymentGateWay: {
    id: 'app.managePaymentGateWay',
    defaultMessage: 'Manage payment gateway',
    description: 'Manage Payment Gateway',
  },
  changePasswordLabel: {
    id: 'app.changePasswordLabel',
    defaultMessage: 'Change password',
    description: 'Change Password',
  },
  searchSettings: {
    id: 'app.searchSettings',
    defaultMessage: 'Search settings',
    description: 'Search Settings',
  },
  imageBannerLabel: {
    id: 'app.imageBannerLabel',
    defaultMessage: 'Image banner',
    description: 'Image Banner',
  },
  bannerCaptionLabel: {
    id: 'app.bannerCaptionLabel',
    defaultMessage: 'Banner caption',
    description: 'Banner Caption',
  },
  bannerCaptionLabel2: {
    id: 'app.bannerCaptionLabel2',
    defaultMessage: 'Marketing Banner',
    description: 'Marketing Banner',
  },
   adminLanguages: {
    id: 'app.adminLanguges',
    defaultMessage: 'Manage languages',
    description: 'Manage Languages',
  },
  bannerPlaceholder: {
    id: 'app.bannerPlaceholder',
    defaultMessage: 'Enter a title',
    description: 'Enter a title',
  },
  bannerPlaceholderContent: {
    id: 'app.bannerPlaceholderContent',
    defaultMessage: 'Enter a content',
    description: 'Enter a content',
  },
  homePageSettings: {
    id: 'app.homePageSettings',
    defaultMessage: 'Home page settings',
    description: 'Home Page Settings',
  },
  staticInfoBlock: {
    id: 'app.staticInfoBlock',
    defaultMessage: 'Static info block',
    description: 'Static Info Block',
  },
  managePopularLocations: {
    id: 'app.managePopularLocations',
    defaultMessage: 'Manage popular locations',
    description: 'Manage Popular locations',
  },
  footerBlockLabel: {
    id: 'app.footerBlockLabel',
    defaultMessage: 'Footer block',
    description: 'Footer Block',
  },
  whyBecomeOwnerPage: {
    id: 'app.whyBecomeOwnerPage',
    defaultMessage: 'Why become owner page',
    description: 'Why Become Owner Page',
  },
  blockLabel: {
    id: 'app.blockLabel',
    defaultMessage: 'Block',
    description: 'Listing Step3'
  },
  carSettingsForStep: {
    id: 'app.carSettingsForStep',
    defaultMessage: 'Car settings for step#',
    description: 'Car Settings for Step'
  },
  reviewHowRentersBook: {
    id: 'app.reviewHowRentersBook',
    defaultMessage: 'Review how renters book',
    description: 'Review How Renters Book'
  },
  minimumDays: {
    id: 'app.minimumDays',
    defaultMessage: 'Minimum days',
    description: 'Minimum Days'
  },
  maximumDays: {
    id: 'app.maximumDays',
    defaultMessage: 'Maximum days',
    description: 'Maximum Days'
  },
  staticContentManagement: {
    id: 'app.staticContentManagement',
    defaultMessage: 'Static content management',
    description: 'Static Content Management',
  },
  contentManagementLabel: {
    id: 'app.contentManagementLabel',
    defaultMessage: 'Content management',
    description: 'Content Management',
  },
  confirmLabel: {
    id: 'app.confirmLabel',
    defaultMessage: 'Confirm',
    description: 'Confirm',
  },
  ibanNumber: {
    id: 'app.ibanNumber',
    defaultMessage: 'IBAN number',
    description: 'ibanNumber',
  },
  confirmIbanNumber: {
    id: 'app.confirmIbanNumber',
    defaultMessage: 'Confirm IBAN number',
    description: 'confirmIbanNumber',
  },
  ibanNumberInvalid: {
    id: 'app.ibanNumberInvalid',
    defaultMessage: 'Invalid IBAN number',
    description: 'ibanNumberInvalid',
  },
  confirmIbanNumberInvalid: {
    id: 'app.confirmIbanNumberInvalid',
    defaultMessage: 'Invalid confirm IBAN number',
    description: 'confirmIbanNumberInvalid',
  },
  confirmIbanNumberMismatch: {
    id: 'app.confirmIbanNumberMismatch',
    defaultMessage: 'IBAN number mismatch',
    description: 'confirmIbanNumberMismatch',
  },
  stripeTokenInfo1: {
    id: 'app.stripeTokenInfo1',
    defaultMessage: 'By clicking, you agree to our terms and the ',
    description: 'stripeTokenInfo1',
  },
  stripeTokenInfo2: {
    id: 'app.stripeTokenInfo2',
    defaultMessage: 'Stripe Connected Account Agreement',
    description: 'stripeTokenInfo2',
  },
  payoutInvalidSortNumber: {
    id: 'app.payoutInvalidSortNumber',
    defaultMessage: 'Invalid sort number',
    description: 'Invalid sort number'
  },
  payoutSortNumber: {
    id: 'app.payoutSortNumber',
    defaultMessage: 'Sort Number',
    description: 'Sort Number for United Kingdom(GB)'
  },
  of: {
    id: 'app.of',
    defaultMessage: 'of',
    description: 'of'
  },
  listingsManagement: {
    id: 'app.listingsManagement',
    defaultMessage: 'Manage cars',
    description: 'Listings Management'
  },
  readyTopay: {
    id: 'app.readyTopay',
    defaultMessage: 'Ready To Pay',
    description: 'readyTopay',
  },
  usersReviews: {
    id: 'app.usersReviews',
    defaultMessage: 'Users Reviews',
    description: 'usersReviews',
  },
  documentVerificationManagement: {
    id: 'app.documentVerificationManagement',
    defaultMessage: 'Manage Document verification',
    description: 'Document Verification Management',
  },
  failed: {
    id: 'app.failed',
    defaultMessage: 'Failed',
    description: 'failed',
  },
  payoutLabel: {
    id: 'app.payoutLabel',
    defaultMessage: 'Payout Amount',
    description: 'Payout Amount',
  },
  paymentGatewaySection: {
    id: 'app.paymentGatewaySection',
    defaultMessage: 'Manage payment gateway',
    description: 'Payout Amount',
  },
  changeAdminEmailPassword: {
    id: 'app.changeAdminEmailPassword',
    defaultMessage: 'Change Admin Email/Password',
    description: 'Change Admin Email/Password',
  },
  homepageBanner: {
    id: 'app.homepageBanner',
    defaultMessage: 'Home page Banner',
    description: 'Home page Banner',
  },
  WhyBecomeOwnerBlock1: {
    id: 'app.WhyBecomeOwnerBlock1',
    defaultMessage: 'Why Become Owner Block 1',
    description: 'Why Become Owner Block 1',
  },
  WhyBecomeOwnerBlock2: {
    id: 'app.WhyBecomeOwnerBlock2',
    defaultMessage: 'Why Become Owner Block 2',
    description: 'Why Become Owner Block 2',
  },
  WhyBecomeOwnerBlock3: {
    id: 'app.WhyBecomeOwnerBlock3',
    defaultMessage: 'Why Become Owner Block 3',
    description: 'Why Become Owner Block 3',
  },
  WhyBecomeOwnerBlock4: {
    id: 'app.WhyBecomeOwnerBlock4',
    defaultMessage: 'Why Become Owner Block 4',
    description: 'Why Become Owner Block 4',
  },
  WhyBecomeOwnerBlock5: {
    id: 'app.WhyBecomeOwnerBlock5',
    defaultMessage: 'Why Become Owner Block 5',
    description: 'Why Become Owner Block 5',
  },
  WhyBecomeOwnerBlock6: {
    id: 'app.WhyBecomeOwnerBlock6',
    defaultMessage: 'Why Become Owner Block 6',
    description: 'Why Become Owner Block 6',
  },
  whyBecomeOwnerBlock7: {
    id: 'app.whyBecomeOwnerBlock7',
    defaultMessage: 'Why Become Owner Block 7',
    description: 'whyBecomeOwnerBlock7',
  },
  editPageDetails: {
    id: 'app.editPageDetails',
    defaultMessage: 'Edit Page Details',
    description: 'Edit Page Details',
  },
  staticPageManagement: {
    id: 'app.staticPageManagement',
    defaultMessage: 'Static Page Management',
    description: 'Static Page Management',
  },
  addPageDetails: {
    id: 'app.addPageDetails',
    defaultMessage: 'Add Page Details',
    description: 'Add Page Details',
  },
  clickHeretoUploadLogo: {
    id: 'app.clickHeretoUploadLogo',
    defaultMessage: 'Choose file',
    description: 'Choose file',
  },
  clickHeretoUploadImage: {
    id: 'app.clickHeretoUploadImage',
    defaultMessage: 'Choose file',
    description: 'Click Here to Upload Image',
  },
  toDay: {
    id: 'app.toDay',
    defaultMessage: 'Today',
    description: 'Today',
  },
  noPhoneNumbeRentered: {
    id: 'app.noPhoneNumbeRentered',
    defaultMessage: 'No phone number added yet!',
    description: 'noPhoneNumbeRentered',
  },
  socialShareDesc: {
    id: 'app.socialShareDesc',
    defaultMessage: 'Check out ',
    description: 'socialShareDesc',
  },
  editPopularLocation: {
    id: 'app.editPopularLocation',
    defaultMessage: 'Edit popular location',
    description: 'editPopularLocation',
  },
  stripePublishableKey: {
    id: 'app.stripePublishableKey',
    defaultMessage: 'Stripe publishable key',
    description: 'Stripe publishable key'
  },
  listings: {
    id: 'app.listings',
    defaultMessage: 'Listings',
    description: 'listings',
  },
  stripeContent: {
    id: 'app.stripeContent',
    defaultMessage: 'Stripe',
    description: 'Stripe'
  },
  icalPlaceHolderTextOne: {
    id: 'app.icalPlaceHolderTextOne',
    defaultMessage: 'Paste calendar address (URL) here',
    description: 'Paste calendar address (URL) here'
  },
  icalPlaceHolderTextTwo: {
    id: 'app.icalPlaceHolderTextTwo',
    defaultMessage: 'Custom name for this calendar',
    description: 'Custom name for this calendar'
  },
  adminRoleLabel: {
    id: 'app.adminRoleLabel',
    defaultMessage: 'Admin role',
    description: 'Admin role',
  },
  addadminRoleLabel: {
    id: 'app.addadminRoleLabel',
    defaultMessage: 'Add Admin role',
    description: 'Add Admin role'
  },
  manageAdmin: {
    id: 'app.manageAdmin',
    defaultMessage: 'Manage admins',
    description: 'Manage admins',
  },
  manageAdminUsers: {
    id: 'app.manageAdminUsers',
    defaultMessage: 'Manage admin users',
    description: 'Manage Admin Users',
  },
  manageAdminRoles: {
    id: 'app.manageAdminRoles',
    defaultMessage: 'Manage admin roles',
    description: 'Manage Admin Roles',
  },
  roleLabel: {
    id: 'app.roleLabel',
    defaultMessage: 'Role',
    description: 'Role',
  },
  adminUserDesc: {
    id: 'app.adminUserDesc',
    defaultMessage: 'Provide new password only. Ignore this field to use the existing password for this user.',
    description: 'Provide new password only. Ignore this field to use the existing password for this user.',
  },
  selectroleLabel: {
    id: 'app.selectroleLabel',
    defaultMessage: 'Select role',
    description: 'Select role',
  },
  roleNameLabel: {
    id: 'app.roleNameLabel',
    defaultMessage: 'Role name',
    description: 'Role name',
  },
  descriptionAdminLabel: {
    id: 'app.descriptionAdminLabel',
    defaultMessage: 'Description',
    description: 'Description',
  },
  privilagesLabel: {
    id: 'app.privilagesLabel',
    defaultMessage: 'Privileges',
    description: 'Privileges',
  },
  roles: {
    id: 'app.roles',
    defaultMessage: 'Roles',
    description: 'roles',
  },
  userLoggedIn: {
    id: 'app.userLoggedIn',
    defaultMessage: 'You are already logged in as User, please logout in the main site to continue!',
    description: 'You are already Logged-in as user',
  },
  pngOnlyLabel: {
    id: 'app.pngOnlyLabel',
    defaultMessage: '* png images only',
    description: '* png images only',
  },
  favIconlogoLabel: {
    id: 'app.favIconlogoLabel',
    defaultMessage: 'Favicon',
    description: 'Favicon'
  },
  securityDeposit: {
    id: 'app.securityDeposit',
    defaultMessage: 'Security deposit',
    description: 'Pricing section',
  },
  securityDepositInvalid: {
    id: 'app.securityDepositInvalid',
    defaultMessage: 'Invalid Security Price, only numbers(eg: 25) are allowed',
    description: 'Price Invalid',
  },
  totalPaid: {
    id: 'app.totalPaid',
    defaultMessage: 'Total paid',
    description: 'Itinerary label',
  },
  securityDepositByRenter: {
    id: 'app.securityDepositByRenter',
    defaultMessage: 'Security deposit amount',
    description: 'Receipt label',
  },
  claimDamage: {
    id: 'app.claimDamage',
    defaultMessage: 'Claim damage',
    description: 'Claim modal',
  },
  depositAmount: {
    id: 'app.depositAmount',
    defaultMessage: 'Deposit amount',
    description: 'Claim modal',
  },
  claimAmount: {
    id: 'app.claimAmount',
    defaultMessage: 'Claim amount',
    description: 'Claim modal',
  },
  reasonForClaim: {
    id: 'app.reasonForClaim',
    defaultMessage: 'Reason for the claim',
    description: 'Claim modal',
  },
  uploadClaimImage: {
    id: 'app.uploadClaimImage',
    defaultMessage: 'Upload image',
    description: 'Claim modal',
  },
  uploadClaimImageInfo: {
    id: 'app.uploadClaimImageInfo',
    defaultMessage: '*Please upload clear photos of your damaged vehicle with registration number',
    description: 'Claim modal',
  },
  claimAmountInvalid: {
    id: 'app.claimAmountInvalid',
    defaultMessage: 'Invalid Claim Amount, only numbers(eg: 25) are allowed',
    description: 'Claim modal',
  },
  claimAmountBigger: {
    id: 'app.claimAmountBigger',
    defaultMessage: 'Claim amount shouldn\'t be bigger than security deposit',
    description: 'Claim modal',
  },
  requestedForClaim: {
    id: 'app.requestedForClaim',
    defaultMessage: 'Requested for claim',
    description: 'Claim modal',
  },
  securityDepositClaimedMessage: {
    id: 'app.securityDepositClaimedMessage',
    defaultMessage: 'Security deposit claimed by owner',
    description: 'View message label',
  },
  securityDepositRefundedMessage: {
    id: 'app.securityDepositRefundedMessage',
    defaultMessage: 'Security deposit refunded',
    description: 'View message label',
  },
  claimDetails: {
    id: 'app.claimDetails',
    defaultMessage: 'Claim details',
    description: 'View message label',
  },
  claimRefunded: {
    id: 'app.claimRefunded',
    defaultMessage: 'Refunded',
    description: 'View message label',
  },
  refundedSecurityDeposit: {
    id: 'app.refundedSecurityDeposit',
    defaultMessage: 'Security deposit amount refunded',
    description: 'View receipt label',
  },
  manageSecurityDeposit: {
    id: 'app.manageSecurityDeposit',
    defaultMessage: 'Manage security deposit',
    description: 'Admin panel side menu',
  },
  amountClaimedByOwner: {
    id: 'app.amountClaimedByOwner',
    defaultMessage: 'Claim amount requested by owner',
    description: 'Host claim modal',
  },
  bookingId: {
    id: 'app.bookingId',
    defaultMessage: 'ID',
    description: 'Admin panel securit deposit'
  },
  ownerDetails: {
    id: 'app.ownerDetails',
    defaultMessage: 'Owner Details',
    description: 'Admin panel securit deposit'
  },
  renterDetails: {
    id: 'app.renterDetails',
    defaultMessage: 'Renter Details',
    description: 'Admin panel securit deposit'
  },
  bookingInformation: {
    id: 'app.bookingInformation',
    defaultMessage: 'Booking information',
    description: 'Admin panel securit deposit'
  },
  securityDepositAmount: {
    id: 'app.securityDepositAmount',
    defaultMessage: 'Security Deposit amount',
    description: 'Admin panel securit deposit'
  },
  claimAction: {
    id: 'app.claimAction',
    defaultMessage: 'Action',
    description: 'Admin panel securit deposit'
  },
  claimAll: {
    id: 'app.claimAll',
    defaultMessage: 'All',
    description: 'Admin panel securit deposit'
  },
  claimedReservation: {
    id: 'app.claimedReservation',
    defaultMessage: 'Claimed',
    description: 'Admin panel securit deposit'
  },
  nonClaimedReservation: {
    id: 'app.nonClaimedReservation',
    defaultMessage: 'Non-Claimed',
    description: 'Admin panel securit deposit'
  },
  adminClaimModalHeading: {
    id: 'app.adminClaimModalHeading',
    defaultMessage: 'Refund',
    description: 'Admin claim refund modal'
  },
  enterClaimAmount: {
    id: 'app.enterClaimAmount',
    defaultMessage: 'Enter claim amount',
    description: 'Host claim modal'
  },
  enterClaimReason: {
    id: 'app.enterClaimReason',
    defaultMessage: 'Describe the reason for the claim',
    description: 'Host claim modal'
  },
  claimRefund: {
    id: 'app.claimRefund',
    defaultMessage: 'Refund amount to renter',
    description: 'Admin claim refund modal'
  },
  enterClaimRefund: {
    id: 'app.enterClaimRefund',
    defaultMessage: 'Enter amount',
    description: 'Admin claim refund modal'
  },
  statusOrAction: {
    id: 'app.statusOrAction',
    defaultMessage: 'Action / Status',
    description: 'Admin claim refund modal'
  },
  proceedToRefund: {
    id: 'app.proceedToRefund',
    defaultMessage: 'Proceed to refund',
    description: 'Admin claim refund'
  },
  securityDepositClaimed: {
    id: 'app.securityDepositClaimed',
    defaultMessage: 'Claimed',
    description: 'Admin claim refund'
  },
  claimAmountRequestedFromTheOwner: {
    id: 'app.claimAmountRequestedFromTheOwner',
    defaultMessage: 'Claim amount requested from the owner',
    description: 'Admin claim refund'
  },
  pleaseCheck: {
    id: 'app.pleaseCheck',
    defaultMessage: '*Please check',
    description: 'Admin claim refund'
  },
  claimRefundBigger: {
    id: 'app.claimRefundBigger',
    defaultMessage: 'Claim refund shouldn\'t be bigger than security deposit',
    description: 'Claim refund modal',
  },
  submitRefund: {
    id: 'app.submitRefund',
    defaultMessage: 'Refund',
    description: 'Claim refund modal',
  },
  basePriceInfo: {
    id: 'app.basePriceInfo',
    defaultMessage: 'Per day price',
    description: 'Claim refund modal',
  },
  deliveryInfo: {
    id: 'app.deliveryInfo',
    defaultMessage: 'Doorstep delivery price for the renter',
    description: 'Doorstep delivery price for renterl',
  },
  infoContent: {
    id: 'app.infoContent',
    defaultMessage: 'This price will be refunded to renter if no claims has been done within 24 hrs after the trip is completed.',
    description: 'This price will be refunded to renter if no claims has been done within 24 hrs after trip end time',
  },
  viewReservationHeading: {
    id: 'app.viewReservationHeading',
    defaultMessage: 'Reservation Details',
    description: 'View reservation page',
  },
  securityDepositToGuest: {
    id: 'app.securityDepositToGuest',
    defaultMessage: 'Security deposit refunded to the Renter',
    description: 'View reservation page',
  },
  securityDepositToHost: {
    id: 'app.securityDepositToHost',
    defaultMessage: 'Security deposit amount Claimed by Owner',
    description: 'View reservation page',
  },
  securityDepositAmountToHost: {
    id: 'app.securityDepositAmountToHost',
    defaultMessage: 'Security deposit amount claimed by Owner',
    description: 'View receipt page',
  },
  claimAmountSharedToOwner: {
    id: 'app.claimAmountSharedToOwner',
    defaultMessage: 'Security deposit amount claimed by Owner',
    description: 'View receipt page',
  },
  estimatedEarnings: {
    id: 'app.estimatedEarnings',
    defaultMessage: 'Estimated earnings',
    description: 'Estimated Earnings Type'
  },
  actualEarnings: {
    id: 'app.actualEarnings',
    defaultMessage: 'Actual earnings',
    description: 'Actual earnings Type'
  },
  securityDepositClaim: {
    id: 'app.securityDepositClaim',
    defaultMessage: 'Security deposit amount',
    description: 'Security deposit amount'
  },
  claimedByOwnerClaim: {
    id: 'app.claimedByOwnerClaim',
    defaultMessage: 'Security deposit amount requested by Owner',
    description: 'Security deposit amount requested by Owner'
  },
  claimRefundedMessage: {
    id: 'app.claimRefundedMessage',
    defaultMessage: 'Security deposit amount refunded',
    description: 'Security deposit amount refunded'
  },
  placesToStay: {
    id: 'app.placesToStay',
    defaultMessage: 'Book your car',
    description: 'Book your Cars',
  },
  rentNowText: {
    id: 'app.rentNowText',
    defaultMessage: 'Rent now',
    description: 'rentNowText',
  },
  viewAllText: {
    id: 'app.viewAllText',
    defaultMessage: 'View all',
    description: 'viewAllText',
  },
  noteLabel: {
    id: 'app.noteLabel',
    defaultMessage: 'Note',
    description: 'Note',
  },
  languageCurrency: {
    id: 'app.languageCurrency',
    defaultMessage: 'Language / Currency',
    description: 'languageCurrency',
  },
  showAllPhotos: {
    id: 'app.showAllPhotos',
    defaultMessage: 'Show all photos',
    description: 'Show all photos',
  },
  followUsText: {
    id: 'app.followUsText',
    defaultMessage: 'Follow us',
    description: 'followUsText',
  },
  buttonLink: {
    id: 'app.buttonLink',
    defaultMessage: 'Button link',
    description: 'Button link',
  },
  findYourCar: {
    id: 'app.findYourCar',
    defaultMessage: 'Find your car',
    description: 'findYourCar',
  },
  findYourCarInfo: {
    id: 'app.findYourCarInfo',
    defaultMessage: 'Find your car info block',
    description: 'Find your car info block',
  },
  expandContent: {
    id: 'app.expandContent',
    defaultMessage: 'Expand',
    description: 'expandContent',
  },
  mapListing: {
    id: 'app.mapListing',
    defaultMessage: 'View cars',
    description: 'Listings',
  },
  closeAllLabel: {
    id: 'app.closeAllLabel',
    defaultMessage: 'Close all',
    description: 'Close all',
  },
  loginWith: {
    id: 'app.loginWith',
    defaultMessage: 'Login with',
    description: 'Log in with',
  },
  resetPassword: {
    id: 'app.resetPassword',
    defaultMessage: 'Reset password?',
    description: 'Reset password',
  },
  createYourAccount: {
    id: 'app.createYourAccount',
    defaultMessage: 'Create your account with',
    description: 'Create your account with',
  },
  clearAll: {
    id: 'app.clearAll',
    defaultMessage: 'Clear all',
    description: 'clearAll',
  },
  yourLocationLabelDesc: {
    id: 'app.yourLocationLabelDesc',
    defaultMessage: 'Search your location ex: USA or other countries',
    description: 'Search your location ex: USA or other countries',
  },
  reviewandPay: {
    id: 'app.reviewandPay',
    defaultMessage: 'Confirm and pay',
    description: 'reviewandPay',
  },
  readText: {
    id: 'app.readText',
    defaultMessage: 'Read',
    description: 'readText',
  },
  rulesDes: {
    id: 'app.rulesDes',
    defaultMessage: ' car rules before start the ride.',
    description: 'rulesDes',
  },
  PaymentmethodText: {
    id: 'app.PaymentmethodText',
    defaultMessage: 'Payment method',
    description: 'PaymentmethodText',
  },
  paymentText: {
    id: 'app.paymentText',
    defaultMessage: 'Choose your preferable payment method.',
    description: 'paymentText',
  },
  livesIn: {
    id: 'app.livesIn',
    defaultMessage: 'Lives in',
    description: 'livesIn',
  },
  dateStart: {
    id: 'app.dateStart',
    defaultMessage: 'Start date',
    description: 'Trip start',
  },
  dateEnd: {
    id: 'app.dateEnd',
    defaultMessage: 'End date',
    description: 'Trip end',
  },
  deepLinkBundleId: {
    id: 'app.deepLinkBundleId',
    defaultMessage: 'Deep link bundle ID',
    description: 'deepLinkBundleId',
  },
  smtpHost: {
    id: 'app.smtpHost',
    defaultMessage: 'SMTP host',
    description: 'smtpHost',
  },
  smtpPort: {
    id: 'app.smtpPort',
    defaultMessage: 'SMTP port',
    description: 'smtpPort',
  },
  smptEmail: {
    id: 'app.smptEmail',
    defaultMessage: 'SMTP email',
    description: 'smptEmail',
  },
  smtpSender: {
    id: 'app.smtpSender',
    defaultMessage: 'SMTP sender',
    description: 'smtpSender',
  },
  smtpSenderEmail: {
    id: 'app.smtpSenderEmail',
    defaultMessage: 'SMTP sender email',
    description: 'smtpSenderEmail',
  },
  smtpPassWord: {
    id: 'app.smtpPassWord',
    defaultMessage: 'SMTP password',
    description: 'smtpPassWord',
  },
  twillioAccountSid: {
    id: 'app.twillioAccountSid',
    defaultMessage: 'Twilio account SID',
    description: 'twillioAccountSid',
  },
  twillioAuthToken: {
    id: 'app.twillioAuthToken',
    defaultMessage: 'Twilio auth token',
    description: 'twillioAuthToken',
  },
  twillioPhone: {
    id: 'app.twillioPhone',
    defaultMessage: 'Twilio phone number',
    description: 'twillioPhone',
  },
  paypalClientId: {
    id: 'app.paypalClientId',
    defaultMessage: 'PayPal client id',
    description: 'paypalClientId',
  },
  paypalSecret: {
    id: 'app.paypalSecret',
    defaultMessage: 'PayPal secret key',
    description: 'paypalSecret',
  },
  paypalHost: {
    id: 'app.paypalHost',
    defaultMessage: 'PayPal host',
    description: 'paypalHost',
  },
  maxUploadLabel: {
    id: 'app.maxUploadLabel',
    defaultMessage: 'Maximum image upload size [MB/KB]',
    description: 'maxUploadLabel',
  },
  manageSiteConfig: {
    id: 'app.manageSiteConfig',
    defaultMessage: 'Manage site configurations',
    description: 'manageSiteConfig',
  },
  googleSecretId: {
    id: 'app.googleSecretId',
    defaultMessage: 'Google secret id',
    description: 'googleSecretId',
  },
  googleClientId: {
    id: 'app.googleClientId',
    defaultMessage: 'Google client id',
    description: 'googleClientId',
  },
  manageForceUpdate: {
    id: 'app.manageForceUpdate',
    defaultMessage: 'Force update',
    description: 'manageForceUpdate'
  },
  androidVersion: {
    id: 'app.androidVersion',
    defaultMessage: 'Android version',
    description: 'androidVersion'
  },
  iosVersion: {
    id: 'app.iosVersion',
    defaultMessage: 'iOS version',
    description: 'iosVersion'
  },
  deepLinkContent: {
    id: 'app.deepLinkContent',
    defaultMessage: 'Deep link JSON content',
    description: 'deepLinkContent'
  },
  stripeSettings: {
    id: 'app.stripeSettings',
    defaultMessage: 'Stripe account settings',
    description: 'stripeSettings'
  },
  twillioSettings: {
    id: 'app.twillioSettings',
    defaultMessage: 'Twilio account settings',
    description: 'twillioSettings'
  },
  smtpSettings: {
    id: 'app.smtpSettings',
    defaultMessage: 'SMTP mail settings',
    description: 'smtpSettings'
  },
  paypalSettings: {
    id: 'app.paypalSettings',
    defaultMessage: 'PayPal account settings',
    description: 'paypalSettings'
  },
  googleSettings: {
    id: 'app.googleSettings',
    defaultMessage: 'Google id settings',
    description: 'googleSettings'
  },
  pushNotificationSettings: {
    id: 'app.pushNotificationSettings',
    defaultMessage: 'Push notification settings',
    description: 'pushNotificationSettings'
  },
  deepLinkSettings: {
    id: 'app.deepLinkSettings',
    defaultMessage: 'Deep link settings',
    description: 'deepLinkSettings'
  },
  yourLocation: {
    id: 'app.yourLocation',
    defaultMessage: 'Your location',
    description: 'yourLocation'
  },
  searchYourLocation: {
    id: 'app.searchYourLocation',
    defaultMessage: 'Search your location',
    description: 'searchYourLocation'
  },
  searchToolTip: {
    id: 'app.searchToolTip',
    defaultMessage: 'Search your location ex: USA or other countries',
    description: 'searchToolTip'
  },
  stepPinText: {
    id: 'app.stepPinText',
    defaultMessage: 'Is the pin in the right place?',
    description: 'stepPinText'
  },
  step2PhotoTitle: {
    id: 'app.step2PhotoTitle',
    defaultMessage: 'Let\'s have a look at your Car!',
    description: 'step2PhotoTitle'
  },
  SetAsCoverPhoto: {
    id: 'app.SetAsCoverPhoto',
    defaultMessage: 'Set as cover photo',
    description: 'Set as cover photo',
  },
  coverPhototext: {
    id: 'app.coverPhototext',
    defaultMessage: 'Cover photo',
    description: 'coverPhototext',
  },
  descriptionStepText: {
    id: 'app.descriptionStepText',
    defaultMessage: 'Let\'s get a name for your Car!',
    description: 'descriptionStepText',
  },
  descriptionToolTip: {
    id: 'app.descriptionToolTip',
    defaultMessage: 'Attract more renters with a crispy title and description that makes your car special.',
    description: 'descriptionToolTip',
  },
  setPricingText: {
    id: 'app.setPricingText',
    defaultMessage: 'Set pricing',
    description: 'setPricingText',
  },
  setDiscounts: {
    id: 'app.setDiscounts',
    defaultMessage: 'Set discounts',
    description: 'setDiscounts',
  },
  discountToolTip: {
    id: 'app.discountToolTip',
    defaultMessage: 'Discounts for longer renting periods.',
    description: 'Discounts for longer renting periods.',
  },
  availabilityWindowText: {
    id: 'app.availabilityWindowText',
    defaultMessage: 'Availability window',
    description: 'Availability window',
  },
  availabilityTripText: {
    id: 'app.availabilityTripText',
    defaultMessage: 'Availability window, Trip length & Cancellation',
    description: 'Availability window, Trip length & Cancellation',
  },
  renterInfo: {
    id: 'app.renterInfo',
    defaultMessage: 'Renter info',
    description: 'Renter info',
  },
  calendarTripText: {
    id: 'app.calendarTripText',
    defaultMessage: 'Note: To unblock a date, select any blocked or available date and save without giving special price.',
    description: 'calendarTripText',
  },
  bookingTypeTitle: {
    id: 'app.bookingTypeTitle',
    defaultMessage: 'What is your preferred booking type',
    description: 'What is your preferred booking type',
  },
  linkText: {
    id: 'app.linkText',
    defaultMessage: 'Link',
    description: 'Link',
  },
  hiText: {
    id: 'app.hiText',
    defaultMessage: 'Hi',
    description: 'Hi',
  },
  onboardText: {
    id: 'app.onboardText',
    defaultMessage: 'Let\’s get you ready to become an owner...',
    description: 'onboardText',
  },
  LetsgoText: {
    id: 'app.LetsgoText',
    defaultMessage: 'Let\'s go!',
    description: 'LetsgoText',
  },
  moreLabel: {
    id: 'app.moreLabel',
    defaultMessage: 'More',
    description: 'More',
  },
  updatePhotoLabel: {
    id: 'app.updatePhotoLabel',
    defaultMessage: 'Update photo',
    description: 'Update photo',
  },
  genderLabel: {
    id: 'app.genderLabel',
    defaultMessage: 'Gender',
    description: 'Gender',
  },
  addNewListing: {
    id: 'app.addNewListing',
    defaultMessage: 'Add new',
    description: 'yourCar',
  },
  upcomingTab: {
    id: 'app.upcomingTab',
    defaultMessage: 'Upcoming',
    description: 'yourCar',
  },
  previousTab: {
    id: 'app.previousTab',
    defaultMessage: 'Previous',
    description: 'yourCar',
  },
  searchReservations: {
    id: 'app.searchReservations',
    defaultMessage: 'Search your reservations',
    description: 'reservations',
  },
  sortByOldest: {
    id: 'app.sortByOldest',
    defaultMessage: 'Sort by oldest',
    description: 'reservations',
  },
  sortByNewest: {
    id: 'app.sortByNewest',
    defaultMessage: 'Sort by newest',
    description: 'reservations',
  },
  sortByoder: {
    id: 'app.sortByoder',
    defaultMessage: 'Sort by order',
    description: 'reservations',
  },
  filterByCar: {
    id: 'app.filterByCar',
    defaultMessage: 'Filter by cars',
    description: 'reservations',
  },
  filterByDate: {
    id: 'app.filterByDate',
    defaultMessage: 'Filter by date',
    description: 'reservations',
  },
  startDate: {
    id: 'app.startDate',
    defaultMessage: 'Start date',
    description: 'reservations',
  },
  endDate: {
    id: 'app.endDate',
    defaultMessage: 'End date',
    description: 'reservations',
  },
  allCars: {
    id: 'app.allCars',
    defaultMessage: 'All cars',
    description: 'reservations',
  },
  searchByCars: {
    id: 'app.searchByCars',
    defaultMessage: 'Search your cars',
    description: 'reservations',
  },
  searchTransactions: {
    id: 'app.SearchTransactions',
    defaultMessage: 'Search your transactions',
    description: 'SearchTransactions',
  },
  filterByPayout: {
    id: 'app.filterByPayout',
    defaultMessage: 'Filter by payout methods',
    description: 'Filter',
  },
  filterByCars: {
    id: 'app.filterByCars',
    defaultMessage: 'Filter by cars',
    description: 'Filter',
  },
  languageAndCurrency: {
    id: 'app.languageAndCurrency',
    defaultMessage: 'Language & Currency',
    description: 'Language & Currency',
  },
  verify: {
    id: 'app.verify',
    defaultMessage: 'Verify',
    description: 'Verify',
  },
  documents: {
    id: 'app.documents',
    defaultMessage: 'Documents',
    description: 'Documents',
  },
  aboutMe: {
    id: 'app.aboutMe',
    defaultMessage: 'About me',
    description: 'aboutMe',
  },
  closeAll: {
    id: 'app.closeAll',
    defaultMessage: 'Close all',
    description: 'Close all',
  },
  enterPhoneNumber: {
    id: 'app.enterPhoneNumber',
    defaultMessage: 'Enter phone number',
    description: 'Enter phone number',
  },
  enterOtpDigit: {
    id: 'app.enterOtpDigit',
    defaultMessage: 'Enter 4 - digit code',
    description: 'Enter 4 - digit code',
  },
  confirmed: {
    id: 'app.confirmed',
    defaultMessage: 'Confirmed',
    description: 'Confirmed',
  },
  youreviewedfor: {
    id: 'app.youreviewedfor',
    defaultMessage: 'You reviewed',
    description: 'You reviewed',
  },
  reviewedTheLabel: {
    id: 'app.reviewedTheLabel',
    defaultMessage: 'reviewed the',
    description: 's review',
  },
  bookedBy: {
    id: 'app.bookedBy',
    defaultMessage: 'Booked by',
    description: 'bookedBy',
  },
  vehicleDetails: {
    id: 'app.vehicleDetails',
    defaultMessage: 'Vehicle details',
    description: 'vehicleDetails',
  },
  importCalenderUrl: {
    id: 'app.importCalenderUrl',
    defaultMessage: 'URL is required',
    description: 'importCalenderUrl',
  },
  importCalenderName: {
    id: 'app.importCalenderName',
    defaultMessage: 'Name is required',
    description: 'importCalenderName',
  },
  flexibleContentOne: {
    id: 'app.flexibleContentOne',
    defaultMessage: '100% refund if canceled before 1 day',
    description: '100% refund if canceled before 1 day',
  },
  flexibleContentTwo: {
    id: 'app.flexibleContentTwo',
    defaultMessage: 'For example: say a renter booked a trip and their check-in date is  on June 09th.',
    description: 'For example: say a renter booked a trip and their check-in date is  on June 09th.',
  },
  flexibleBeforeOneDay: {
    id: 'app.flexibleBeforeOneDay',
    defaultMessage: 'Before 1 day:',
    description: 'Before 1 day:',
  },
  flexibleBeforeOneDayContentOne: {
    id: 'app.flexibleBeforeOneDayContentOne',
    defaultMessage: 'A full refund will be processed if a renter cancels a booking before 1 day',
    description: 'A full refund will be processed if a renter cancels a booking before 1 day',
  },
  flexibleBeforeOneDayContentTwo: {
    id: 'app.flexibleBeforeOneDayContentTwo',
    defaultMessage: 'For example: if a renter cancels the booking on June 08th, a 100% refund will be processed.',
    description: 'For example: if a renter cancels the booking on June 08th, a 100% refund will be processed.',
  },
  cancellationCheckIn: {
    id: 'app.cancellationCheckIn',
    defaultMessage: 'Check-in:',
    description: 'Check-in:',
  },
  flexibleCheckInContentOne: {
    id: 'app.flexibleCheckInContentOne',
    defaultMessage: 'If a renter cancels their booking on  the check-in date, then the first day of the trip is non-refundable.',
    description: 'If a renter cancels their booking on  the check-in date, then the first day of the trip is non-refundable.',
  },
  flexibleCheckInContentTwo: {
    id: 'app.flexibleCheckInContentTwo',
    defaultMessage: 'For example: if a renter cancels the booking on June 09th, the first day of the trip is non-refundable, and the rest will be refunded.',
    description: 'For example: if a renter cancels the booking on June 09th, the first day of the trip is non-refundable, and the rest will be refunded.',
  },
  cancellationCheckOut: {
    id: 'app.cancellationCheckOut',
    defaultMessage: 'Checkout:',
    description: 'Checkout:',
  },
  flexibleCheckOutContentOne: {
    id: 'app.flexibleCheckOutContentOne',
    defaultMessage: 'The accommodation fees for the days not spent will be returned if a renter checks in and decides to leave early.',
    description: 'The accommodation fees for the days not spent will be returned if a renter checks in and decides to leave early.',
  },
  flexibleCheckOutContentTwo: {
    id: 'app.flexibleCheckOutContentTwo',
    defaultMessage: 'For example: if a renter cancels the booking on June 10th, the first two days of the trip  are non-refundable, and the rest will be refunded.',
    description: 'For example: if a renter cancels the booking on June 10th, the first two days of the trip  are non-refundable, and the rest will be refunded.',
  },
  moderateContentOne: {
    id: 'app.moderateContentOne',
    defaultMessage: '100% refund only if canceled 5 days before check-in date.',
    description: '100% refund only if canceled 5 days before check-in date.',
  },
  moderateContentTwo: {
    id: 'app.moderateContentTwo',
    defaultMessage: 'For ex: say a renter booked a trip and their check-in date is on June 08th.',
    description: 'For ex: say a renter booked a trip and their check-in date is on June 08th.',
  },
  moderateBeforeFiveDay: {
    id: 'app.moderateBeforeFiveDay',
    defaultMessage: 'Before 5 days:',
    description: 'Before 5 days:',
  },
  moderateBeforeFiveDayContentOne: {
    id: 'app.moderateBeforeFiveDayContentOne',
    defaultMessage: 'Only if a renter cancels their reservation 5 days prior to the check-in date will they receive a full refund.',
    description: 'Only if a renter cancels their reservation 5 days prior to the check-in date will they receive a full refund.',
  },
  moderateBeforeFiveDayContentTwo: {
    id: 'app.moderateBeforeFiveDayContentTwo',
    defaultMessage: 'For ex: if a renter cancels the booking on or before June 03th, a 100% refund will be processed.',
    description: 'For ex: if a renter cancels the booking on or before June 03th, a 100% refund will be processed.',
  },
  moderateCheckInContentOne: {
    id: 'app.moderateCheckInContentOne',
    defaultMessage: 'If a renter cancels their booking less than 5 days before the check-in date, then the first day of the trip is non-refundable. but the 50% amount for the rest of the days will be refunded.',
    description: 'If a renter cancels their booking less than 5 days before the check-in date, then the first day of the trip is non-refundable. but the 50% amount for the rest of the days will be refunded.',
  },
  moderateCheckInContentTwo: {
    id: 'app.moderateCheckInContentTwo',
    defaultMessage: 'For ex: if a renter cancels their reservation after June 03th, the first day of their trip is non-refundable, and 50% of the remaining days will be refunded.',
    description: 'For ex: if a renter cancels their reservation after June 03th, the first day of their trip is non-refundable, and 50% of the remaining days will be refunded.',
  },
  moderateCheckOutContentOne: {
    id: 'app.moderateCheckOutContentOne',
    defaultMessage: '50% of the accommodation fees for the days not spent will be refunded (24hrs after the cancellation) if a renter checks in and decides to leave early.',
    description: '50% of the accommodation fees for the days not spent will be refunded (24hrs after the cancellation) if a renter checks in and decides to leave early.',
  },
  strictContentOne: {
    id: 'app.strictContentOne',
    defaultMessage: '50% refund only if canceled 7 days before check-in date.',
    description: '50% refund only if canceled 7 days before check-in date.',
  },
  strictContentTwo: {
    id: 'app.strictContentTwo',
    defaultMessage: 'For ex: say a renter booked a trip and their check-in date is on June 08th.',
    description: 'For ex: say a renter booked a trip and their check-in date is on June 08th.',
  },
  strictBeforeSevenDay: {
    id: 'app.strictBeforeSevenDay',
    defaultMessage: 'Before 7 days:',
    description: 'Before 7 days:',
  },
  reviewsAboutYou: {
    id: 'app.reviewsAboutYou',
    defaultMessage: 'Reviews about you',
    description: 'Reviews about you',
  },
  reviewsByYou: {
    id: 'app.reviewsByYou',
    defaultMessage: 'Reviews by you',
    description: 'Review',
  },
  responded: {
    id: 'app.responded',
    defaultMessage: 'Responded',
    description: 'responded',
  },
  notResponded: {
    id: 'app.notResponded',
    defaultMessage: 'Not responded',
    description: 'notResponded',
  },
  reply: {
    id: 'app.reply',
    defaultMessage: 'Reply',
    description: 'reply',
  },
  reviewsToWrite: {
    id: 'app.reviewsToWrite',
    defaultMessage: 'Reviews to write',
    description: 'reviewsToWrite',
  },
  writtenReviews: {
    id: 'app.writtenReviews',
    defaultMessage: 'Written reviews',
    description: 'writtenReviews',
  },
  noReviewHeading: {
    id: 'app.noReviewHeading',
    defaultMessage: 'There are no reviews about you yet!',
    description: 'There are no reviews by you yet.',
  },
  noReviewSubHeding: {
    id: 'app.noReviewSubHeding',
    defaultMessage: 'Reviews are written at the end of a reservation. Reviews you’ve received will be visible both here and on your public profile.',
    description: 'Reviews are written at the end of a reservation. Reviews you’ve received will be visible both here and on your public profile.',
  },
  searchReviews: {
    id: 'app.searchReviews',
    defaultMessage: 'Search reviews',
    description: 'Search reviews',
  },
  strictBeforeSevenDayContentOne: {
    id: 'app.strictBeforeSevenDayContentOne',
    defaultMessage: 'Only if a renter cancels their reservation 7 days prior to the check-in date will they receive a 50% refund.',
    description: 'Only if a renter cancels their reservation 7 days prior to the check-in date will they receive a 50% refund.',
  },
  strictBeforeSevenDayContentTwo: {
    id: 'app.strictBeforeSevenDayContentTwo',
    defaultMessage: 'For ex: if a renter cancels the booking on or  before  June 01st, a 50% refund will be processed.',
    description: 'For ex: if a renter cancels the booking on or  before  June 01st, a 50% refund will be processed.',
  },
  strictCheckInContentOne: {
    id: 'app.strictCheckInContentOne',
    defaultMessage: 'There will be no refund if a renter cancels their booking less than 7 days before the check-in date.',
    description: 'There will be no refund if a renter cancels their booking less than 7 days before the check-in date.',
  },
  strictCheckInContentTwo: {
    id: 'app.strictCheckInContentTwo',
    defaultMessage: 'For ex: no refund will be given if a renter cancels their reservation after June 01st.',
    description: 'For ex: no refund will be given if a renter cancels their reservation after June 01st.',
  },
  strictCheckOutContentOne: {
    id: 'app.strictCheckOutContentOne',
    defaultMessage: 'If a renter checks in and decides to leave early, there will be no refund for the days not spent.',
    description: 'If a renter checks in and decides to leave early, there will be no refund for the days not spent.',
  },
  searchYourTrips: {
    id: 'app.searchYourTrips',
    defaultMessage: 'Search your trips',
    description: 'Search your trips',
  },
  paid: {
    id: 'app.paid',
    defaultMessage: 'Paid',
    description: 'Paid ',
  },
  writeReviewFor: {
    id: 'app.writeReviewFor',
    defaultMessage: 'Write review for',
    description: 'Write review for',
  },
  uploadedImages: {
    id: 'app.uploadedImages',
    defaultMessage: 'Uploaded images',
    description: 'Uploaded images',
  },
  print: {
    id: 'app.print',
    defaultMessage: 'Print',
    description: 'Print',
  },
  enterOldPassword: {
    id: 'app.enterOldPassword',
    defaultMessage: 'Enter your current password',
    description: 'Enter your current password',
  },
  confirmNewPassword: {
    id: 'app.confirmNewPassword',
    defaultMessage: 'Confirm your new password',
    description: 'Confirm new password',
  },
  paymentPayouts: {
    id: 'app.paymentPayouts',
    defaultMessage: 'Payments & Payouts',
    description: 'paymentPayouts',
  },
  yourPaypalEmail: {
    id: 'app.yourPaypalEmail',
    defaultMessage: 'Enter your PayPal email',
    description: 'Enter your Paypal email',
  },
  earningsLabel: {
    id: 'app.earningsLabel',
    defaultMessage: 'Earnings',
    description: 'Earnings',
  },
  estimatedEarningsLabel: {
    id: 'app.estimatedEarningsLabel',
    defaultMessage: 'Estimated earnings:',
    description: 'Estimated earnings:',
  },
  actualEarningsLabel: {
    id: 'app.actualEarningsLabel',
    defaultMessage: 'Actual earnings:',
    description: 'Actual earnings:',
  },
  shareModalHeading: {
    id: 'app.shareModalHeading',
    defaultMessage: 'Share this with your friends and family!',
    description: 'Share this with your friends and family!',
  },
  editYourProfile: {
    id: 'app.editYourProfile',
    defaultMessage: 'Edit your personal info',
    description: 'Edit your profile',
  },
  hostingLabel: {
    id: 'app.hostingLabel',
    defaultMessage: 'Hosting',
    description: 'Hosting',
  },
  travellingLabel: {
    id: 'app.travellingLabel',
    defaultMessage: 'Travelling',
    description: 'Travelling',
  },
  whyHostPage: {
    id: 'app.whyHostPage',
    defaultMessage: 'Why host page',
    description: 'Why Host Page',
  },
  uploadSizedLabel: {
    id: 'app.uploadSizedLabel',
    defaultMessage: 'Maximum upload size',
    description: 'uploadSizedLabel',
  },
  invalidPasswordSpace: {
    id: 'app.invalidPasswordSpace',
    defaultMessage: 'Password should not contain any spaces.',
    description: 'invalidPasswordSpace',
  },
  tellMeWhyToCancel: {
    id: 'app.tellMeWhyToCancel',
    defaultMessage: 'Tell me why you need to cancel?',
    description: 'Tell me why you need to cancel?',
  },
  cancelReasonHost: {
    id: 'app.cancelReasonHost',
    defaultMessage: 'Enter your reason to cancel this reservation.',
    description: 'Enter your reason to cancel this reservation.',
  },
  cancelReasonGuest: {
    id: 'app.cancelReasonGuest',
    defaultMessage: 'Enter your reason to cancel this trip.',
    description: 'Enter your reason to cancel this trip.',
  },
  keepYourTrip: {
    id: 'app.keepYourTrip',
    defaultMessage: 'Keep your trip',
    description: 'Keep your trip',
  },
  noTransactionContent: {
    id: 'app.noTransactionContent',
    defaultMessage: 'You do not have any completed transactions for the selected listings, and payout method.',
    description: 'You do not have any completed transactions for the selected listings, and payout method.',
  },
  noTripTitle: {
    id: 'app.noTripTitle',
    defaultMessage: 'No upcoming trips found!',
    description: 'noTripTitle',
  },
  noPreviousTripTitle: {
    id: 'app.noPreviousTripTitle',
    defaultMessage: 'No previous trips found!',
    description: 'noPreviousTripTitle',
  },
  carsAvailable: {
    id: 'app.carsAvailable',
    defaultMessage: 'available for Rent in',
    description: 'share',
  },
  birthdayLabel: {
    id: 'app.birthdayLabel',
    defaultMessage: 'Birthday',
    description: 'Birthday',
  },
  searchFilterSettings: {
    id: 'app.searchFilterSettings',
    defaultMessage: 'Search filter settings',
    description: 'Search filter settings',
  },
  dashBoardHeader1: {
    id: 'app.dashBoardHeader1',
    defaultMessage: 'Hello',
    description: 'Dashboard',
  },
  guestLabel: {
    id: 'app.guestLabel',
    defaultMessage: 'Renter',
    description: 'Guest',
  },
  hostLabel: {
    id: 'app.hostLabel',
    defaultMessage: 'Owner',
    description: 'Host',
  },
  feeTypeLabel: {
    id: 'app.feeTypeLabel',
    defaultMessage: 'Fee type',
    description: 'Fee type',
  },
  serviceFeeLabel: {
    id: 'app.serviceFeeLabel',
    defaultMessage: 'Service fee',
    description: 'Service fee',
  },
  tripCancel: {
    id: 'app.tripCancel',
    defaultMessage: 'This trip will be cancelled immediately.',
    description: 'Cancel your trip',
  },
  editCarName: {
    id: 'app.editCarName',
    defaultMessage: 'Edit your car name',
    description: 'Edit your car name',
  },
  specialpriceInvalid: {
    id: 'app.specialpriceInvalid',
    defaultMessage: 'Invalid special price',
    description: 'Invalid special price',
  },
  weeklyDiscountTooltip: {
    id: 'app.weeklyDiscountTip',
    defaultMessage: 'This will be applied when a guest books more than a week.',
    description: 'Weekly discount tooltip',
  },
  monthlyDiscountTooltip: {
    id: 'app.monthlyDiscountTooltip',
    defaultMessage: 'This will be applied when a guest books more than a month.',
    description: 'Monthly discount tooltip',
  },
  removeProfilePhoto: {
    id: 'app.removeProfilePhoto',
    defaultMessage: 'Remove photo',
    description: 'Remove photo',
  },
  fcmPushNotificationKey: {
    id: 'app.fcmPushNotificationKey',
    defaultMessage: 'FCM push notification key',
    description: 'Fcm push notification key',
  },
  startExplore: {
    id: 'app.startExplore',
    defaultMessage: 'Start explore',
    description: 'Start explore',
  },
  newWishList: {
    id: 'app.newWishList',
    defaultMessage: 'New wishlist',
    description: 'New wishlist',
  },
  noReviewHeadingByYou: {
    id: 'app.noReviewHeadingByYou',
    defaultMessage: 'There are no reviews by you yet!',
    description: 'noReviewHeadingByYou explore',
  },
  requestBookContent: {
    id: 'app.requestBookContent',
    defaultMessage: 'Your booking request send to',
    description: 'noReviewHeadingByYou explore',
  },
  maxPriceError: {
    id: 'app.maxPriceError',
    defaultMessage: 'Maximum price must be greater than minimum price',
    description: 'maxPriceError',
  },
  cancelTrip: {
    id: 'app.cancelTrip',
    defaultMessage: 'Cancel trip',
    description: 'Cancel trip',
  },
  claimPayoutLabel: {
    id: 'app.claimPayoutLabel',
    defaultMessage: 'Claim Payout amount(Owner)',
    description: 'Claim payout',
  },
  phoneLabel: {
    id: 'app.phoneLabel',
    defaultMessage: 'Phone',
    description: 'Phone',
  },
  claimPayout: {
    id: 'app.claimPayout',
    defaultMessage: 'Claim payout',
    description: 'Claim payout',
  },
  PaymentTypeText: {
    id: 'app.PaymentTypeText',
    defaultMessage: 'Payment type',
    description: 'Payment type',
  },
  cancellationDescription: {
    id: 'app.cancellationDescription',
    defaultMessage: 'Description:',
    description: 'Description:',
  },
  securityDepositClaimdebyOwner: {
    id: 'app.securityDepositClaimdebyOwner',
    defaultMessage: 'Security deposit claimed by owner',
    description: 'Inbox section',
  },
  claimStatus: {
    id: 'app.claimStatus',
    defaultMessage: 'Claim status',
    description: 'Claim status',
  },
  securityDepositRefunded: {
    id: 'app.securityDepositRefunded',
    defaultMessage: 'Security deposit refunded',
    description: 'securityDepositRefunded',
  },
  enterTheEmailAddress: {
    id: 'app.enterTheEmailAddress',
    defaultMessage: 'Enter the Email address',
    description: 'securityDepositRefunded',
  },
  enterYourPassword: {
    id: 'app.enterYourPassword',
    defaultMessage: 'Enter your password',
    description: 'Enter your password',
  },
  currencyText: {
    id: 'app.currencyText',
    defaultMessage: 'Currency',
    description: 'Currency',
  },
  forgotPasswordNewPassword: {
    id: 'app.forgotPasswordNewPassword',
    defaultMessage: 'New password',
    description: 'forgotPasswordNewPassword',
  },
  androidLabel: {
    id: 'app.androidLabel',
    defaultMessage: 'Android',
    description: 'androidVersion'
  },
  iosLabel: {
    id: 'app.iosLabel',
    defaultMessage: 'iOS',
    description: 'iosVersion'
  },
  admin: {
    id: 'app.admin',
    defaultMessage: 'Admin',
    description: 'Admin',
  },
  claimPaidToHost: {
    id: 'app.claimPaidToHost',
    defaultMessage: 'Security deposit claim amount obtained',
    description: 'Claim amount',
  },
  carIDText: {
    id: 'app.carIDText',
    defaultMessage: 'Car ID',
    description: 'Car ID',
  },
  viewCountTotal3: {
    id: 'app.viewCountTotal3',
    defaultMessage: 'time by the people.',
    description: 'View listing view count details',
  },
  refreshToolTip: {
    id: 'app.refreshToolTip',
    defaultMessage: 'Please click this icon to sync your email verification on the same browser.',
    description: 'refreshToolTip',
  },
  noWishlistModal: {
    id: 'app.noWishlistModal',
    defaultMessage: 'Create your first wishlist!',
    description: 'noWishlistModal',
  },
  minTripLength: {
    id: 'app.minTripLength',
    defaultMessage: 'Minimum trip length',
    description: 'Trip Length',
  },
  maxTripLength: {
    id: 'app.maxTripLength',
    defaultMessage: 'Maximum trip length',
    description: 'Trip Length',
  },
  maxTripLength2: {
    id: 'app.maxTripLength2',
    defaultMessage: 'Maximum hours',
    description: 'Maximum hours'
  },
  minTripLengt2: {
    id: 'app.minTripLengt2',
    defaultMessage: 'Minimum hours',
    description: 'Minimum hours'
  },
  content1: {
    id: 'app.content1',
    defaultMessage: 'Content #1',
    description: 'Content #1',
  },
  content2: {
    id: 'app.content2',
    defaultMessage: 'Content #2',
    description: 'Content #2',
  },
  content3: {
    id: 'app.content3',
    defaultMessage: 'Content #3',
    description: 'Content #3',
  },
  title1: {
    id: 'app.title1',
    defaultMessage: 'Title 1',
    description: 'Title 1',
  },
  title2: {
    id: 'app.title2',
    defaultMessage: 'Title 2',
    description: 'Title 2',
  },
  title3: {
    id: 'app.title3',
    defaultMessage: 'Title 3',
    description: 'Title 3',
  },
  footerContent1: {
    id: 'app.footerContent1',
    defaultMessage: 'Content 1',
    description: 'Content 1',
  },
  footerContent2: {
    id: 'app.footerContent2',
    defaultMessage: 'Content 2',
    description: 'Content 2',
  },
  addAdminUserLabel: {
    id: 'app.addAdminUserLabel',
    defaultMessage: 'Add Admin user',
    description: 'Add Admin user',
  },
  footerContent3: {
    id: 'app.footerContent3',
    defaultMessage: 'Content 3',
    description: 'Content 3',
  },
  whyHostTooltipText: {
    id: 'app.whyHostTooltipText',
    defaultMessage: ' The added informations in the page will reflect in the mobile application why owner page.',
    description: ' The added informations in the page will reflect in the mobile application why owner page.',
  },
  hostServiceFeeTooltipText: {
    id: 'app.hostServiceFeeTooltipText',
    defaultMessage: 'Service fees have been subtracted from your earnings.',
    description: 'Host service fee',
  },
  importMake: {
    id: 'app.importMake',
    defaultMessage: 'Import make',
    description: 'Import make',
  },
  importModel: {
    id: 'app.importModel',
    defaultMessage: 'Import model',
    description: 'Import model',
  },
  sampleSheet: {
    id: 'app.sampleSheet',
    defaultMessage: 'Sample sheet',
    description: 'Sample sheet',
  },
  sampleSheetTooltipText: {
    id: 'app.sampleSheetTooltipText',
    defaultMessage: 'You can download the sample sheet by clicking on this option. Afterward, please convert the sheet into CSV and import the file in the same format as demonstrated on the sample sheet.',
    description: 'Sample sheet',
  },
  csvImporting: {
    id: 'app.csvUploading',
    defaultMessage: 'Importing. . .',
    description: 'Sample sheet',
  },
  minimumStayText: {
    id: 'app.minimumStayText',
    defaultMessage: 'Minimum rent is',
    description: 'minimumStay day error',
  },
  ogImageLabel: {
    id: 'app.ogImageLabel',
    defaultMessage: 'OG Image',
    description: 'OG Image'
  },
  ogToolTip: {
    id: 'app.ogToolTip',
    defaultMessage: "It's the image that represents your webpage when shared on platforms like Facebook, X, or LinkedIn.(Recommended size: at least 1,200 x 630 pixels with a file size under 8MB)",
    description: 'OG Tool Tip'
  },
  securityDepositAvailability: {
    id: 'app.securityDepositAvailability',
    defaultMessage: "Security deposit availability",
    description: 'Security deposit availability'
  },
  securityDepositAvailabilityTooltip: {
    id: 'app.securityDepositAvailabilityTooltip',
    defaultMessage: "Enable this option to allow hosts to set security deposits for their vehicles.",
    description: 'Enable this option to allow hosts to set security deposits for their vehicles.'
  },
  twilioAuthErr: {
    id: 'app.twilioAuthErr',
    defaultMessage: 'Authentication Error - Invalid Key',
    description: 'Authentication Error',
  },
  cancellationDesc1: {
    id: 'app.cancellationDesc1',
    defaultMessage: 'Delivery fees and Service fees are refundable only if the renter cancels prior to check-in date based on the policies.',
    description: 'Delivery fees and Service fees are refundable only if the renter cancels prior to check-in date based on the policies.',
  },
  cancellationDesc2: {
    id: 'app.cancellationDesc2',
    defaultMessage: 'Base fees (the total day rate you\'re charged) are refundable in certain circumstances as outlined below.',
    description: 'Base fees (the total day rate you\'re charged) are refundable in certain circumstances as outlined below.'
  },
  cancellationDesc3: {
    id: 'app.cancellationDesc3',
    defaultMessage: 'If there is a complaint from either party, notice must be given to the platform ',
    description: 'If there is a complaint from either party, notice must be given to '
  },
  cancellationTripStart: {
    id: 'app.cancellationTripStart',
    defaultMessage: ' within 24 hours of trip start.',
    description: 'Within 24 hours of trip start. '
  },
  cancellationDesc4: {
    id: 'app.cancellationDesc4',
    defaultMessage: 'The platform will mediate when necessary, and has the final say in all disputes.',
    description: 'Will mediate when necessary, and has the final say in all disputes. '
  },
  cancellationDesc5: {
    id: 'app.cancellationDesc5',
    defaultMessage: 'A reservation is officially canceled when the renter clicks the cancellation button on the cancellation confirmation page, which they can find in the dashboard - your trips - cancel',
    description: 'A reservation is officially canceled when the renter clicks the cancellation button on the cancellation confirmation page, which they can find in the dashboard > your trips > cancel.'
  },
  cancellationDesc6: {
    id: 'app.cancellationDesc6',
    defaultMessage: 'Cancellation policies may be superseded by the renter refund policy, extenuating circumstances, or cancellations by the platform',
    description: 'Cancellation policies may be superseded by the renter refund policy, extenuating circumstances, or cancellations by'
  },
  cancellationReview: {
    id: 'app.cancellationReview',
    defaultMessage: ' for any other reason permitted under the terms of service. Please review these exceptions.',
    description: 'For any other reason permitted under the terms of service. Please review these exceptions.'
  },
  cancellationDesc7: {
    id: 'app.cancellationDesc7',
    defaultMessage: 'Applicable taxes will be retained and remitted.',
    description: 'Applicable taxes will be retained and remitted.'
  },
  inputTextLimitError: {
    id: 'app.inputTextLimitError',
    defaultMessage: 'Limit exceeded! you can add up to 250 characters',
    description: 'Limit exceeded! you can add up to 250 characters',
  },
  inputDescLimitError: {
    id: 'app.inputDescLimitError',
    defaultMessage: 'Limit exceeded! You can enter up to 10,000 characters',
    description: 'Limit exceeded! You can enter up to 10,000 characters',
  },
  rentBy: {
    id: 'app.rentBy',
    defaultMessage: 'Rented by',
    description: 'rentBy',
  },
  phoneNumberVerificationInfo1: {
    id: 'app.phoneNumberVerificationInfo1',
    defaultMessage: 'I agree to receive a message from',
    description: 'phoneNumberVerificationInfo'
  },
  phoneNumberVerificationInfo2: {
    id: 'app.phoneNumberVerificationInfo2',
    defaultMessage: 'at the phone number provided above. I understand I will receive messages for the verification purposes. Click here to see the',
    description: 'phoneNumberVerificationInfo'
  },
  termsAndPrivacy: {
    id: 'app.termsAndPrivacy',
    defaultMessage: 'Terms and Privacy',
    description: 'phoneNumberVerificationInfo'
  },
});

export default messages;