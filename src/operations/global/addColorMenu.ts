import { ColorSchemeRepository } from "~src/repository/colorSchemeRepository";
import { GlobalRepository } from "~src/repository/globalRepository"

export default () => {

    const repository = ColorSchemeRepository.getInstance();

    GlobalRepository.getInstance()
    .getNavigationRight()
    .then(navRight => {
        // clone separator
        navRight.insertBefore(navRight.children[3].cloneNode(true), navRight.children[0]);
        // clone settings button
        const clonedMenuButton = navRight.children[6].cloneNode(true);
        navRight.insertBefore(clonedMenuButton, navRight.children[0]);
        const menuButton = navRight.children[0];

        // change button text
        menuButton.querySelector("d2l-navigation-dropdown-button-icon")?.setAttribute("text", "Color Menu");

        // change menu button icon
        GlobalRepository.getInstance().waitForElement(() => {
            return menuButton
                ?.querySelector("d2l-navigation-dropdown-button-icon")
                ?.shadowRoot
                ?.querySelector("d2l-icon")
                ?.shadowRoot
                ?.querySelector("svg");
        }).then((svg) => {
            svg.innerHTML =`
                <path d="m3 0c-1.6447 0-3 1.3553-3 3v24.02c0 0.24609 0.021484 0.32422 0.021484 0.32422 0.15694 1.3461 1.2209 2.4309 2.5566 2.623 0 0 0.13281 0.0332 0.4375 0.0332h23.984c1.6447 0 3-1.3553 3-3v-6c0-1.3363-0.89559-2.4808-2.1133-2.8633 0.86516-0.94016 1.0651-2.381 0.39648-3.5391l-3-5.1953c-0.56456-0.97785-1.6098-1.5307-2.6758-1.502-0.19678 0.0053154-0.39288 0.036732-0.58789 0.082031 0.28057-1.2469-0.26339-2.5968-1.4219-3.2656l-5.1953-3c-0.4443-0.25652-0.93458-0.39119-1.4199-0.4043-0.77616-0.020965-1.5411 0.26807-2.1191 0.80469-0.38137-1.2195-1.5256-2.1172-2.8633-2.1172zm0 2h6c0.5713 0 1 0.4287 1 1v24c0 0.5713-0.4287 1-1 1h-6c-0.5713 0-1-0.4287-1-1v-24c0-0.5713 0.4287-1 1-1zm10.928 1.3125c0.15917 0.0043 0.31919 0.045032 0.47461 0.13477l5.1953 3c0.49557 0.28612 0.65298 0.87023 0.36719 1.3652l-1.0371 1.7949-2e-3 0.00195-6.9257 11.998v-16l1.0352-1.7949c0.19602-0.33952 0.5389-0.50955 0.89258-0.5zm8.7344 6.5879c0.35189-0.0095 0.69344 0.16041 0.89062 0.50195l3 5.1953c0.286 0.49537 0.12894 1.0819-0.36523 1.3672l-1.7949 1.0352-0.23242 0.13477-11.766 6.791 7.9961-13.852 1.7969-1.0391c0.15542-0.089732 0.31544-0.13047 0.47461-0.13477zm2.2656 10.1h2.0723c0.5713 0 1 0.4287 1 1v6c0 0.5713-0.4287 1-1 1h-15.178c0.05908-0.1644 0.10527-0.33398 0.13476-0.50977l5.9609-3.4434zm-18.928 1.5c-1.3689 0-2.5 1.1311-2.5 2.5s1.1311 2.5 2.5 2.5 2.5-1.1311 2.5-2.5-1.1311-2.5-2.5-2.5zm0 2c0.28799 0 0.5 0.21201 0.5 0.5s-0.21201 0.5-0.5 0.5-0.5-0.21201-0.5-0.5 0.21201-0.5 0.5-0.5z"/>
            `;
        });

        // stop button from dissapearing when window is scaled
        (menuButton as HTMLElement).style.setProperty('display', 'block');

        // remove content of dropdown
        const dropdown = menuButton.querySelector("d2l-dropdown-content");
        dropdown?.childNodes.forEach(c => c.remove());
        dropdown?.shadowRoot?.childNodes.forEach(c => c.remove());

        // create new dropdown content
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'd2l-body-compact d2l-admin-tools';
        dropdownMenu.innerHTML = `
            <h2 style="margin-bottom: 10px;">Change color scheme</h2>
            <div style="display: flex;justify-content: space-between; align-items: center;">
                <span>enable color scheme:</span>
                <input type="checkbox" style="width:18px;height:18px;" `+(repository.isEnabled() ? "checked" : "")+`>
            </div>
            <hr/>
            <div style="display: flex;justify-content: space-between; align-items: center;">
                <span>main color:</span>
                <input type="color" style="background-color: transparent; border-width: 0px; padding: 0px;" 
                    value="`+repository.getMainColor()+`">
            </div>
            <div style="display: flex;justify-content: space-between; align-items: center;">
                <span>background primary:</span>
                <input type="color" style="background-color: transparent; border-width: 0px; padding: 0px;" 
                    value="`+repository.getBackgroundPrimary()+`"">
            </div>
            <div style="display: flex;justify-content: space-between; align-items: center;">
                <span>background secondary:</span>
                <input type="color" style="background-color: transparent; border-width: 0px; padding: 0px;" 
                    value="`+repository.getBackgroundSecondary()+`">
            </div>
            <div style="display: flex;justify-content: space-between; align-items: center;">
                <span>foreground color:</span>
                <input type="color" style="background-color: transparent; border-width: 0px; padding: 0px;" 
                    value="`+repository.getForegroundColor()+`">
            </div>
        `;

        // add color schemes enabled checkbox functionality
        (dropdownMenu.children?.[1].children?.[1] as HTMLElement).onchange = (e) => {
            repository.setEnabled((e.target as HTMLInputElement).checked);
        }

        // add main color picker functionality
        (dropdownMenu.children?.[3].children?.[1] as HTMLElement).oninput = (e) => {
            repository.setMainColor((e.target as HTMLInputElement).value);
        }

        // add backround primary color picker functionality
        (dropdownMenu.children?.[4].children?.[1] as HTMLElement).oninput = (e) => {
            repository.setBackgroundPrimary((e.target as HTMLInputElement).value);
        }

        // add backround secondary color picker functionality
        (dropdownMenu.children?.[5].children?.[1] as HTMLElement).oninput = (e) => {
            repository.setBackgroundSecondary((e.target as HTMLInputElement).value);
        }

        // add foreground color picker functionality
        (dropdownMenu.children?.[6].children?.[1] as HTMLElement).oninput = (e) => {
            repository.setForegroundColor((e.target as HTMLInputElement).value);
        }

        dropdown?.appendChild(dropdownMenu);

    });
}