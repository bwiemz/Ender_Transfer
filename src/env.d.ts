// Ambient type declarations for unresolved workspace packages
declare module "@enderfall/ui" {
    export const Button: any;
    export const Input: any;
    export const Panel: any;
    export const SideMenu: any;
    export const SideMenuSubmenu: any;
    export const Dropdown: any;
    export const MainHeader: any;
    export const ContextMenu: any;
    export const ActivityLog: any;
    export const AppModals: any;
    export const ConnectionPanel: any;
    export const DetailsPanel: any;
    export const LocalPane: any;
    export const PaneSortMenu: any;
    export const PreviewModal: any;
    export const RemotePane: any;
    export const Sidebar: any;
    export const TransferPanel: any;
    export const applyTheme: any;
    export const getStoredTheme: any;
    export const AccessGate: any;
    export const PreferencesModal: any;
    export const Toggle: any;
    export const Modal: any;
    // Fallback for any other imported stuff
    const content: any;
    export default content;
}

declare module "@enderfall/runtime" {
    export const readSharedPreferences: any;
    export const writeSharedPreferences: any;
    export const isEntitledForApp: any;
    export const openAppBrowser: any;
    export const refreshLaunchToken: any;
    export type LaunchToken = any;
    const content: any;
    export default content;
}
