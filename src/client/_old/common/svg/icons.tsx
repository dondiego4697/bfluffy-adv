/* eslint-disable max-len */
import * as React from 'react';

export const LOGO_SVG = (
    <svg width="36" height="39" viewBox="0 0 36 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M33.9644 18.7808V37.0001H2.0376V18.7808" stroke="black" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 18.773L18 2L34 18.773" stroke="black" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.0001 29.091C21.2696 29.091 23.9201 26.4709 23.9201 23.2389C23.9201 20.0068 21.2696 17.3867 18.0001 17.3867C14.7306 17.3867 12.0801 20.0068 12.0801 23.2389C12.0801 26.4709 14.7306 29.091 18.0001 29.091Z" stroke="black" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CAMERA_SVG = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const CHEVRON_SVG = (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 7L7 0.999999L1 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const LENS_SVG = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.9999C13.4183 16.9999 17 13.4182 17 8.99997C17 4.58171 13.4183 1 9 1C4.58172 1 1 4.58171 1 8.99997C1 13.4182 4.58172 16.9999 9 16.9999Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 19L14.65 14.6499" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SEX_FEMALE_SVG = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z" fill="#F85F59"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9549 12C14.1249 12 15.9098 10.2234 15.9098 8C15.9098 5.7766 14.1249 4 11.9549 4C9.78487 4 8 5.7766 8 8C8 10.2234 9.78487 12 11.9549 12ZM17.9098 8C17.9098 10.9544 15.7904 13.4101 13 13.9079V17H15.4286C15.9809 17 16.4286 17.4477 16.4286 18C16.4286 18.5523 15.9809 19 15.4286 19H13V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V19H8.57145C8.01916 19 7.57145 18.5523 7.57145 18C7.57145 17.4477 8.01916 17 8.57145 17H11V13.9233C8.16515 13.4629 6 10.9862 6 8C6 4.68629 8.66609 2 11.9549 2C15.2437 2 17.9098 4.68629 17.9098 8Z" fill="white"/>
    </svg>
);

export const SEX_MALE_SVG = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z" fill="#80CFE0"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0001 4C12.4478 4 12.0001 4.44772 12.0001 5C12.0001 5.55228 12.4478 6 13.0001 6H16.5859L13.9794 8.60647C11.635 6.92321 8.35008 7.13526 6.24271 9.24263C3.89956 11.5858 3.89957 15.3848 6.24271 17.7279C8.58586 20.0711 12.3848 20.0711 14.728 17.7279C16.8251 15.6308 17.0453 12.3676 15.3887 10.0256L18.0001 7.41424V11C18.0001 11.5523 18.4478 12 19.0001 12C19.5523 12 20.0001 11.5523 20.0001 11V5C20.0001 4.44772 19.5523 4 19.0001 4H13.0001ZM13.3138 10.6568C11.7517 9.09475 9.21902 9.09475 7.65692 10.6568C6.09483 12.2189 6.09483 14.7516 7.65692 16.3137C9.21902 17.8758 11.7517 17.8758 13.3138 16.3137C14.8759 14.7516 14.8759 12.2189 13.3138 10.6568Z" fill="white"/>
    </svg>
);

export const USER_SVG = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const CREATE_AD_SVG = (
    <svg width="64" height="64" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
	    <path fill="black" d="M105,23C105,23,105,23,105,23C82.4,0.4,45.6,0.4,23,23C0.4,45.6,0.4,82.4,23,105c11.3,11.3,26.2,17,41,17s29.7-5.7,41-17C127.6,82.4,127.6,45.6,105,23z M100.8,100.8c-20.3,20.3-53.3,20.3-73.5,0C7,80.5,7,47.5,27.2,27.2C37.4,17.1,50.7,12,64,12s26.6,5.1,36.8,15.2C121,47.5,121,80.5,100.8,100.8z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	    <path fill="black" d="M83,61H67V45c0-1.7-1.3-3-3-3s-3,1.3-3,3v16H45c-1.7,0-3,1.3-3,3s1.3,3,3,3h16v16c0,1.7,1.3,3,3,3s3-1.3,3-3V67h16c1.7,0,3-1.3,3-3S84.7,61,83,61z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
