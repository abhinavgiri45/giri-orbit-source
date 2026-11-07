plugins {
  alias(libs.plugins.android.application)
}

android {
  namespace = "com.giricorporation.giriorbit"
  compileSdk = 34

  defaultConfig {
    applicationId = "com.giricorporation.giriorbit"
    minSdk = 24
    targetSdk = 34
    versionCode = 1
    versionName = "1.0.0"
  }

  buildTypes {
    release {
      isMinifyEnabled = false
      proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
  }

  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }

  sourceSets {
    named("main") {
      java.directories("src/main/java")
      assets.directories("src/main/assets")
      res.directories("src/main/res")
    }
  }

  packaging {
    resources {
      excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
  }
}

dependencies {
  implementation(libs.androidx.core.ktx)
}
