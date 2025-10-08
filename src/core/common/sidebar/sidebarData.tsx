import { all_routes } from "../../../feature-module/routes/all_routes";

const routes = all_routes;

export const SidebarData = [
  {
    tittle: "Main Menu",
    icon: "airplay",
    showAsTab: true,
    separateRoute: false,
    submenuItems: [
     {
   label: "Dashboard",
      link: routes.dashboard,
      submenu: false,
      showSubRoute: false,
      icon: "layout-dashboard",
      base: "dashboard",
      materialicons: "start",
      dot: true

}

      // {
      //   label: "Applications",
      //   link: "index",
      //   submenu: true,
      //   showSubRoute: false,
      //   icon: "apps",
      //   base: "dashboard",
      //   materialicons: "start",
      //   dot: true,
      //   submenuItems: [
      //     { label: "Chat", link: routes.chat },
      //     {
      //       label: "Calls",
      //       customSubmenuTwo: true,
      //       submenu: true,
      //       showSubRoute: false,
      //       link: routes.voiceCall,
      //       page1: "voice-call",
      //       page2: "videocall",
      //       base: "calls",
      //       submenuItems: [
      //         {
      //           label: "Voice Call",
      //           link: routes.voiceCall,
      //           submenu: false,
      //           showSubRoute: false,
      //           base: "voice-call",
      //         },
      //         {
      //           label: "Video Call",
      //           link: routes.videoCall,
      //           submenu: false,
      //           showSubRoute: false,
      //           base: "video-call",
      //         },
      //         {
      //           label: "Outgoing Call",
      //           link: routes.outgoingCall,
      //           submenu: false,
      //           showSubRoute: false,
      //           base: "outgoing-call",
      //         },
      //         {
      //           label: "Incoming Call",
      //           link: routes.incomingCall,
      //           submenu: false,
      //           showSubRoute: false,
      //           base: "incoming-call",
      //         },
      //         {
      //           label: "Call History",
      //           link: routes.callHistory,
      //           submenu: false,
      //           showSubRoute: false,
      //           base: "call-history",
      //         },
      //       ],
      //     },
      //     {
      //       label: "Calendar",
      //       showSubRoute: false,
      //       link: routes.calendar,
      //       customSubmenuTwo: false,
      //       base: "calendar",
      //     },
      //     {
      //       label: "Contacts",
      //       showSubRoute: false,
      //       link: routes.contacts,
      //       customSubmenuTwo: false,
      //       base: "kanban",
      //     },

      //     {
      //       label: "Email",
      //       showSubRoute: false,
      //       link: routes.email,
      //       customSubmenuTwo: false,
      //       base: "email",
      //     },
      //     {
      //       label: "Invoices",
      //       customSubmenuTwo: true,
      //       submenu: true,
      //       showSubRoute: false,
      //       link: routes.voiceCall,
      //       page1: "Invoices",
      //       page2: "Invoice Details",
      //       base: "calls",
      //       submenuItems: [
      //         {
      //           label: "Invoices",
      //           link: routes.invoice,
      //           submenu: false,
      //           showSubRoute: false,
      //           base: "voice-call",
      //         },
      //         {
      //           label: "Invoice Details",
      //           link: routes.invoiceDetails,
      //           submenu: false,
      //           showSubRoute: false,
      //           base: "video-call",
      //         },
      //       ],
      //     },
      //     {
      //       label: "To Do",
      //       showSubRoute: false,
      //       link: routes.todo,
      //       customSubmenuTwo: false,
      //       base: "todo",
      //     },
      //     {
      //       label: "Notes",
      //       showSubRoute: false,
      //       link: routes.notes,
      //       customSubmenuTwo: false,
      //       base: "notes",
      //     },
      //     {
      //       label: "Kanban Board",
      //       showSubRoute: false,
      //       link: routes.kanbanView,
      //       customSubmenuTwo: false,
      //       base: "kanban",
      //     },
      //     {
      //       label: "File Manager",
      //       showSubRoute: false,
      //       link: routes.fileManager,
      //       customSubmenuTwo: false,
      //       base: "file-manager",
      //     },

      //     {
      //       label: "Social Feed",
      //       showSubRoute: false,
      //       link: routes.socialFeed,
      //       customSubmenuTwo: false,
      //       base: "social-feed",
      //     },

      //     {
      //       label: "Search Result",
      //       showSubRoute: false,
      //       link: routes.searchList,
      //       customSubmenuTwo: false,
      //       base: "invoices",
      //     },
      //   ],
      // },
      // {
      //   label: "Layouts",
      //   link: "index",
      //   submenu: true,
      //   showSubRoute: false,
      //   icon: "layout-sidebar",
      //   base: "dashboard",
      //   materialicons: "start",
      //   dot: true,
      //   submenuItems: [
      //     {
      //       label: "Default",
      //       showSubRoute: false,
      //       link: routes.layoutDefault,
      //       customSubmenuTwo: false,
      //       base: "Default",
      //     },

      //     {
      //       label: "Mini",
      //       showSubRoute: false,
      //       link: routes.layoutMini,
      //       customSubmenuTwo: false,
      //       base: "Mini",
      //     },
      //     {
      //       label: "Hover View",
      //       showSubRoute: false,
      //       link: routes.layoutHoverView,
      //       customSubmenuTwo: false,
      //       base: "Hover View",
      //     },
      //     {
      //       label: "Hidden",
      //       showSubRoute: false,
      //       link: routes.layoutHidden,
      //       customSubmenuTwo: false,
      //       base: "Hidden",
      //     },
      //     {
      //       label: "Full Width",
      //       showSubRoute: false,
      //       link: routes.layoutFullWidth,
      //       customSubmenuTwo: false,
      //       base: "Full Width",
      //     },
      //     {
      //       label: "Dark",
      //       showSubRoute: false,
      //       link: routes.layoutDark,
      //       customSubmenuTwo: false,
      //       base: "dark",
      //     },
      //     {
      //       label: "RTL",
      //       showSubRoute: false,
      //       link: routes.layoutRTL,
      //       customSubmenuTwo: false,
      //       base: "RTL",
      //     },
      //   ],
      // },
    ],
  },
  {
    tittle: "Clinic",
    icon: "airplay",
    showAsTab: true,
    separateRoute: false,
    submenuItems: [
      {
        label: "Clinic",
        link: "index",
        submenu: true,
        showSubRoute: false,
        icon: "hospital",
        base: "Clinics",
        materialicons: "start",
        dot: true,
        submenuItems: [
          { label: "Clinic", link: routes.clinicList },
          // { label: "Doctor Details", link: routes.doctorsDetails },
          { label: "Add Clinic", link: routes.addClinic },
          // { label: "Doctor Schedule", link: routes.doctorScheduleClini },
        ],
      },
      {
        label: "Doctors",
        link: "index",
        submenu: true,
        showSubRoute: false,
        icon: "user-plus",
        base: "Doctors",
        materialicons: "start",
        dot: true,
        submenuItems: [
          { label: "Doctors", link: routes.doctorsList },
          // { label: "Doctor Details", link: routes.doctorsDetails },
          { label: "Add Doctor", link: routes.addDoctors },
          // { label: "Doctor Schedule", link: routes.doctorScheduleClini },
        ],
      },
      {
        label: "Patients",
        link: "index",
        submenu: true,
        showSubRoute: false,
        icon: "user-heart",
        base: "Patients",
        materialicons: "start",
        dot: true,
        submenuItems: [
          { label: "Patients", link: routes.patients },
          // { label: "Patient Details", link: routes.patientDetails },
          { label: "Create Patient", link: routes.createPatient },
        ],
      },
      {
        label: "Appointments",
        link: "index",
        submenu: true,
        showSubRoute: false,
        icon: "calendar-check",
        base: "Patients",
        materialicons: "start",
        dot: true,
        submenuItems: [
          { label: "Appointments", link: routes.appointments },
          { label: "New Appointment", link: routes.newAppointment },
          // { label: "Calendar", link: routes.appointmentCalendar },
        ],
      },


{
        label: "Billing",
        link: "index",
        submenu: true,
        showSubRoute: false,
        icon: "file-invoice",
        base: "Billing",
        materialicons: "start",
        dot: true,
        submenuItems: [
          { label: "Material Purchase Bills", link: routes.materialpurchasebillList },
          // { label: "Patient Details", link: routes.patientDetails },         
          { label: "Clinic Bills", link: routes.clinicbillList },
          { label: "Lab Bills", link: routes.labbillList },
          { label: "Pharmacy Bills", link: routes.pharmacybillList },
        ],
      },



      
    ],
  },
];
