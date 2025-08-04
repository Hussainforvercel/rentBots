import messages from "../locale/messages";
import iconOne from '/public/SiteIcons/hostStepIcons/carTypeIcon.svg';
import iconTwo from '/public/SiteIcons/hostStepIcons/location.svg';
import iconThree from '/public/SiteIcons/hostStepIcons/features.svg';
import iconFour from '/public/SiteIcons/hostStepIcons/photos.svg';
import iconFive from '/public/SiteIcons/hostStepIcons/description.svg';
import iconSix from '/public/SiteIcons/hostStepIcons/carRules.svg';
import iconSeven from '/public/SiteIcons/hostStepIcons/pricing.svg';
import iconEight from '/public/SiteIcons/hostStepIcons/discount.svg';
import iconNine from '/public/SiteIcons/hostStepIcons/bookingWindow.svg';
import iconTen from '/public/SiteIcons/hostStepIcons/calendar.svg';
import iconEleven from '/public/SiteIcons/hostStepIcons/booking.svg';
import iconTwelve from '/public/SiteIcons/hostStepIcons/renterBook.svg';
import iconThirteen from '/public/SiteIcons/hostStepIcons/localLaws.svg';

let tabBarStep1 = [
  {
    pathname: "car",
    icon: iconOne,
    text: messages.tabPlaceType
  },
  {
    pathname: "map",
    activePaths: ["map", "location"],
    icon: iconTwo,
    text: messages.location
  },
  {
    pathname: "features",
    icon: iconThree,
    text: messages.aminities
  },
];

let tabBarStep2 = [
  {
    pathname: "photos",
    icon: iconFour,
    text: messages.photos
  },
  {
    pathname: "description",
    icon: iconFive,
    text: messages.descriptionAdminLabel
  },
];

let tabBarStep3 = [
  {
    pathname: "car-rules",
    icon: iconSix,
    text: messages.houseRules
  },
  {
    pathname: "pricing",
    icon: iconSeven,
    text: messages.tabPricing
  },
  {
    pathname: "discount",
    icon: iconEight,
    text: messages.tabDiscount
  },
  {
    pathname: "min-max-days",
    icon: iconNine,
    text: messages.bookingWindow
  },
  {
    pathname: "calendar",
    icon: iconTen,
    text: messages.tabCalendar
  },
  {
    pathname: "booking-scenarios",
    icon: iconEleven,
    text: messages.tabBooking
  },
  {
    pathname: "review-how-renters-book",
    icon: iconTwelve,
    text: messages.reviewGuestBook
  },
  {
    pathname: "local-laws",
    icon: iconThirteen,
    text: messages.tabLocalLaws
  },
];

let listingTabs = {
  1: tabBarStep1,
  2: tabBarStep2,
  3: tabBarStep3
}

const activeTabs = (step, listingSteps) => {
  if (listingSteps && listingSteps.step1 === 'completed' && step == 1) {
    return tabBarStep1
  } else if (listingSteps && listingSteps.step2 === 'completed' && step == 2) {
    return tabBarStep2
  } else if (listingSteps && listingSteps.step3 === 'completed' && step == 3) {
    return tabBarStep3
  } else {
    return [];
  }
};

const activeTabIndex = ((pathname, step) => {
  pathname = ["map", "location"].includes(pathname) ? "map" : pathname
  return listingTabs[step]?.findIndex(tab => tab.pathname == pathname)
});

export {
  activeTabs,
  activeTabIndex
};
