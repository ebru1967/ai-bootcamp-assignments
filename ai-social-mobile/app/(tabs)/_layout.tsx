import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Aktif olan sekmenin rengi (Parlak Mavi)
        tabBarActiveTintColor: '#4189e2',
        // Pasif olan sekmenin rengi (Gri tonu)
        tabBarInactiveTintColor: '#7f8c8d',
        headerShown: false,
        tabBarButton: HapticTab,
        
        // --- MODERN APP TASARIMI BURADA BAŞLIYOR ---
        tabBarStyle: {
          backgroundColor: '#1a1a2e', // Uygulamanın gece mavisi temasıyla bütünleşik
          borderTopWidth: 0,          // Üstteki o ince çizgiyi sildik
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          
          // Floating (Yüzen) Tab Bar Efekti
          position: 'absolute',
          bottom: 15,
          left: 20,
          right: 20,
          borderRadius: 30,
          
          // Gölge ayarları (Görünümü derinleştirir)
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 10, // Android için
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginTop: -5,
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Analiz',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Paylaş',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}