# Android Todo List Application

A fully functional Android todo app with clean architecture and modern UI design.

## Features

- ✅ Add tasks to the todo list
- ✅ Mark tasks as completed (tap to toggle)
- ✅ Delete tasks (long press)
- ✅ Persistent storage using SharedPreferences
- ✅ Modern Material Design UI
- ✅ Clean Java code architecture

## Project Structure

```
app/
├── src/main/
│   ├── java/com/todoapp/
│   │   ├── MainActivity.java      # Main activity handling UI and user interactions
│   │   ├── TaskAdapter.java       # Custom ArrayAdapter for ListView
│   │   └── TaskItem.java          # Task model class with JSON serialization
│   ├── res/
│   │   ├── layout/
│   │   │   ├── activity_main.xml  # Main screen layout
│   │   │   └── task_item.xml      # Individual task item layout
│   │   ├── drawable/
│   │   │   └── ic_check_circle.xml # Check circle icon
│   │   ├── values/
│   │   │   ├── strings.xml        # String resources
│   │   │   └── styles.xml         # App theme and styles
│   │   └── AndroidManifest.xml    # App manifest
└── build.gradle                   # App-level build configuration
```

## Setup Instructions

### Prerequisites

- **Android Studio** (latest version recommended)
- **Java Development Kit (JDK)** 8 or higher
- **Android SDK** with API level 21 (Lollipop) or higher
- **Gradle** 7.4.2 (included with Android Studio)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Android-ToDO
   ```

2. **Open in Android Studio:**
   - Launch Android Studio
   - Click "Open an existing Android Studio project"
   - Navigate to the project directory and select it

3. **Sync the project:**
   - Android Studio will prompt you to sync the project
   - Click "Sync Now" to download dependencies

4. **Set up an emulator or device:**
   - **Emulator:** Tools → AVD Manager → Create Virtual Device
   - **Physical Device:** Enable USB debugging and connect your device

5. **Run the app:**
   - Select your emulator/device from the dropdown
   - Click the green "Run" button (▶️) or press `Shift + F10`

## Usage Guide

### Adding Tasks
1. Type your task in the input field
2. Click the "Add" button
3. The task appears in the list below

### Managing Tasks
- **Mark as Complete:** Tap on any task to toggle its completion status
- **Delete Task:** Long press on a task to remove it from the list
- **Visual Indicators:** Completed tasks show with strikethrough text

### Data Persistence
- All tasks are automatically saved to device storage
- Tasks persist when you close and reopen the app
- Data is stored locally using SharedPreferences

## Technical Details

### Architecture
- **MVVM-like pattern** with clear separation of concerns
- **Model:** `TaskItem` class handles data and serialization
- **View:** XML layouts with Material Design components
- **Controller:** `MainActivity` manages UI interactions
- **Adapter:** `TaskAdapter` bridges data and ListView

### Key Technologies
- **Language:** Java 8
- **UI Framework:** Android SDK with Material Design
- **Storage:** SharedPreferences with JSON serialization
- **Build System:** Gradle 7.4.2
- **Min SDK:** 21 (Android 5.0)
- **Target SDK:** 34 (Android 14)

## Build Configuration

The app uses Gradle for dependency management and build configuration. Key settings:

```gradle
android {
    compileSdk 34
    defaultConfig {
        applicationId "com.todoapp"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit changes: `git commit -m "Add feature description"`
5. Push to branch: `git push origin feature-name`
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

**Build Errors:**
- Ensure you have the latest Android Studio
- Update Android SDK tools via SDK Manager
- Clean and rebuild project: `Build → Clean Project` then `Build → Rebuild Project`

**Emulator Issues:**
- Make sure your system has virtualization enabled
- Try different system images if one fails to install
- Allocate sufficient RAM (4GB+ recommended)

**Permission Issues:**
- Ensure `android:allowBackup="true"` in AndroidManifest.xml
- Check storage permissions for API 23+ devices

For additional support, please create an issue in the repository.