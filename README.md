# Security Enhancing Browser Extension - PassMan

## Instructions to set up PassMan

1. Clone the repository into your local computer
2. Goto Chrome web browser
3. In the omni search bar, enter the following: chrome://extensions
4. Toggle the developer mode to on
5. Click on Load Unpacked
6. Select the Browser Extension folder in the cloned repository
7. The extension should be displayed in the browser bar.



## PassMan Features

1. __Detect Password Reuse__: PassMan detects whether the user on registering on a new website, is using a password that has already been used on a different website. The PassMan warns the user that the password he is using to sign up has already been used, and encourages him to use a different password.

2. __Protect from Phishing Attacks__: PassMan also detects whether the user is entering the correct password for the respective correct website. If PassMan detects any phishing attempts, it warns the user that he is using the password of a different website.

3. __Protect from visiting unpopular websites__: PassMan inspects all the links in all the webpages that the user has visited. If the user clicks on any of the links, PassMan checks if the link is in the Alexa top 10k website list. If the link is not in the list, then PassMan warns the user that he is about to visit a website outside of the top 10k website list. The user can choose to either visit the website once or whitelist the website. If the user whitelists the website, PassMan will not warn the user on visiting the website again. The user can also choose to not visit the website, in which case the user stays on the same page. 
