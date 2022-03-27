# ConventionBingo
A buzzword-bingo-esque to play with your weeb friends at conventions. 

Since a few friends of mine and me are always playing some kind of convention bingo with a sheet we pull from google images every time in the last minute, 
I decided to make our lives easier and learn a little more about web development by creating this PWA.
I used HTML, SCSS and Vanilla JS for this as they are the same tools i currently use at my apprenticeship.

## Features
- Playable out of the box with almost 50 different fields
- Installable as a PWA to play offline
- Active sheets can be rerolled and edited freely
- Sheets (including their progress) can be saved, loaded, as well as imported and exported
- You are free to edit, remove or add new fields as you see fit.
- Persistence by utilizing the browsers local Storage

## Installation
### Directly from my website
1. click [here](https://bingo.ranka.moe/) and just play there.
2. install the PWA to your device from the little icon in your URL-bar or the three-dot-menu on your phone.
<img src="https://user-images.githubusercontent.com/48137583/160297934-feaf9fcb-93bd-4a90-a3ff-9443d34951a5.png" width="200">
<img src="https://user-images.githubusercontent.com/48137583/160297762-b234f44f-e349-45a4-a1e9-70b938a65fd3.png" width="200">


### Docker

In case you want to host an instance of this Spaghettiball yourself (for whatever reason), be my guest.
Here is a docker compose script you can use. And [here](https://hub.docker.com/repository/docker/rankarusu/convention-bingo) 
is a link to the container on DockerHub.

```yml
version: "2.2.3"
services:
  con-bingo:
    image: 'rankarusu/convention-bingo:latest'
    container_name: 'con-bingo'
    restart: unless-stopped
    ports:
      - '8888:80'
```
## Screenshots
<p float="left">
   <img src="https://user-images.githubusercontent.com/48137583/160298807-59aa8d8a-bb2a-4c13-8ba0-f6436d8f1c44.gif" width="200">
  <img src="https://user-images.githubusercontent.com/48137583/160298782-ab9c831c-6183-4580-9c42-5bb76f97f51d.png" width="200">
  <img src="https://user-images.githubusercontent.com/48137583/160299010-c099e9fc-d7d8-4e15-97c4-88b57065ebcc.png" width="200">
</p>
