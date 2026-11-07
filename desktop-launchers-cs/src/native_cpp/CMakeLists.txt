cmake_minimum_required(VERSION 3.10)
project(GiriOrbitNativeLaunchers CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_definitions(-DUNICODE -D_UNICODE -DWIN32_LEAN_AND_MEAN)

set(COMMON_LIBS wininet user32 shell32 ole32 advapi32)

add_executable(GiriOrbit WIN32 launcher.cpp app.manifest)
target_link_libraries(GiriOrbit PRIVATE ${COMMON_LIBS})

add_executable(GiriDrift WIN32 GiriDrift.cpp app.manifest)
target_link_libraries(GiriDrift PRIVATE ${COMMON_LIBS})

add_executable(GiriAxis WIN32 GiriAxis.cpp app.manifest)
target_link_libraries(GiriAxis PRIVATE ${COMMON_LIBS})

add_executable(GiriKinetic WIN32 GiriKinetic.cpp app.manifest)
target_link_libraries(GiriKinetic PRIVATE ${COMMON_LIBS})

add_executable(GiriAegis WIN32 GiriAegis.cpp app.manifest)
target_link_libraries(GiriAegis PRIVATE ${COMMON_LIBS})

add_executable(Girionix WIN32 Girionix.cpp app.manifest)
target_link_libraries(Girionix PRIVATE ${COMMON_LIBS})
