package com.aboutmuslim.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import com.aboutmuslim.app.ui.screens.AboutScreen
import com.aboutmuslim.app.ui.screens.HomeScreen
import com.aboutmuslim.app.ui.screens.PrayerScreen
import com.aboutmuslim.app.ui.screens.QuranScreen
import com.aboutmuslim.app.ui.theme.AboutMuslimTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AboutMuslimTheme {
                MainApp()
            }
        }
    }
}

@Composable
fun MainApp() {
    var selectedIndex by remember { mutableIntStateOf(0) }

    val items = listOf(
        NavigationItem(stringResource(R.string.nav_home), Icons.Default.Home),
        NavigationItem(stringResource(R.string.nav_prayer), Icons.Default.Schedule),
        NavigationItem(stringResource(R.string.nav_quran), Icons.Default.Book),
        NavigationItem(stringResource(R.string.nav_about), Icons.Default.Info)
    )

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            NavigationBar {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = selectedIndex == index,
                        onClick = { selectedIndex = index }
                    )
                }
            }
        }
    ) { innerPadding ->
        val modifier = Modifier.padding(innerPadding)
        when (selectedIndex) {
            0 -> HomeScreen(modifier)
            1 -> PrayerScreen(modifier)
            2 -> QuranScreen(modifier)
            3 -> AboutScreen(modifier)
        }
    }
}

data class NavigationItem(
    val label: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector
)
