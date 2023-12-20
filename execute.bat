@echo off
rem Start the Expo app
npx expo start

rem Change directory to the server folder
cd server

rem Execute Docker command to run the image
docker run -p 6080:5000 my_model
