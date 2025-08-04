import React from 'react';
import FooterLessLayout from '../../components/Layout/FooterLessLayout';
import Search from './Search';
import fetch from '../../core/fetch';

import { searchListing } from '../../actions/searchListing';
import { setPersonalizedValues } from '../../actions/personalized';
import { showResults } from '../../actions/mobileSearchNavigation';
import { setLoaderStart, setLoaderComplete } from '../../actions/loader/loader';

const title = 'Search';

export default async function action({ store, query }) {

  await store.dispatch(setLoaderStart('searchListing'));
  // Fetch Search Settings
  const searchQuery = `
      {
        getSearchSettings {
          minPrice
          maxPrice
          priceRangeCurrency
        }
      }
    `;

  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: searchQuery,
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();

  let geoType, lat, lng, sw_lat, sw_lng;
  let ne_lat, ne_lng, personCapacity, dates, geography, currentPage = 1;
  let initialFilter = {}, fixedHeader = 'searchFixedHeader', endBeforeDate, latAndLngQuery;

  const personCapacityData = store.getState().personalized?.personCapacity;
  const startDateData = store.getState().personalized?.startDate;
  const endDateData = store.getState().personalized?.endDate;
  geoType = store.getState().personalized?.geoType;
  lat = store.getState().personalized?.lat;
  lng = store.getState().personalized?.lng;
  sw_lat = store.getState().personalized?.sw_lat;
  sw_lng = store.getState().personalized?.sw_lng;
  ne_lat = store.getState().personalized?.ne_lat;
  ne_lng = store.getState().personalized?.ne_lng;

  endBeforeDate = startDateData > endDateData;

  if ("address" in query && encodeURI(query?.address)) {
    latAndLngQuery = `
            query ($address: String) {
              GetAddressComponents (address:$address) {
                addressComponents
                lat
                lng
                geoType
                sw_lat 
                sw_lng 
                ne_lat 
                ne_lng
              }
            }
          `;
    const locationResp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: latAndLngQuery,
        variables: { address: query?.address }
      }),
      credentials: 'include',
    });

    const { data } = await locationResp.json();
    if (data && data.GetAddressComponents) {
      initialFilter["address"] = query.address;
      initialFilter["geography"] = data.GetAddressComponents.addressComponents;
      initialFilter["lat"] = data.GetAddressComponents.lat;
      initialFilter["lng"] = data.GetAddressComponents.lng;
      initialFilter["sw_lat"] = data.GetAddressComponents.sw_lat;
      initialFilter["sw_lng"] = data.GetAddressComponents.sw_lng;
      initialFilter["ne_lat"] = data.GetAddressComponents.ne_lat;
      initialFilter["ne_lng"] = data.GetAddressComponents.ne_lng;
      geography = data?.GetAddressComponents?.addressComponents;
      geoType = data?.GetAddressComponents?.geoType;
      lat = data?.GetAddressComponents?.lat;
      lng = data?.GetAddressComponents?.lng;
      sw_lat = data?.GetAddressComponents?.sw_lat;
      sw_lng = data?.GetAddressComponents?.sw_lng;
      ne_lat = data?.GetAddressComponents?.ne_lat;
      ne_lng = data?.GetAddressComponents?.ne_lng;
      store.dispatch(setPersonalizedValues({ name: 'location', value: query?.address }));
    }
  } else {
    lat = null;
    lng = null;
    // If no location passed
    ['geography', 'geoType', 'location', 'lat', 'lng', 'chosen'].map((name) => {
      store.dispatch(setPersonalizedValues({ name, value: null }));
    })
  }

  // PersonCapacity
  if (personCapacityData != undefined && personCapacityData != null) {
    personCapacity = personCapacityData;
  } else {
    if ("guests" in query && query.guests) {
      initialFilter["personCapacity"] = Number(query.guests);
      personCapacity = Number(query.guests);
    }
  }

  if (startDateData != undefined && startDateData != null && endDateData != undefined && endDateData != null) {
    dates = `'${startDateData}' AND '${endDateData}'`;
  } else {
    if ("startDate" in query && "endDate" in query && query.startDate && query.endDate) {
      initialFilter["startDate"] = query.startDate;
      initialFilter["endDate"] = query.endDate;
      dates = `'${query.startDate}' AND '${query.endDate}'`;
      store.dispatch(setPersonalizedValues({ name: 'startDate', value: query.startDate }));
      store.dispatch(setPersonalizedValues({ name: 'endDate', value: query.endDate }));
    }
  }
  // Default Map Show
  await store.dispatch(setPersonalizedValues({ name: 'showMap', value: true }));
  await store.dispatch(searchListing({ personCapacity, dates, geography, currentPage, geoType, lat, lng, sw_lat, sw_lng, ne_lat, ne_lng }))
  await store.dispatch(setLoaderComplete('searchListing'));
  await store.dispatch(showResults());

  return {
    title,
    component: <FooterLessLayout page={'search'} fixedHeader={fixedHeader}><Search
      initialFilter={initialFilter}
      searchSettings={data.getSearchSettings}
      endBeforeDate={endBeforeDate}
    />
    </FooterLessLayout>,
  };
};
