import { Tabs } from 'expo-router';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import Octicons from '@expo/vector-icons/Octicons';
import { auth } from '@/services/firebase';
export default function TabLayout() {
return (
  <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0356C5',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: 'black',
        },
      }}
    >
      <Tabs.Screen
        name="homepage"
        options={{
          title: 'Homepage',
          tabBarIcon: ({ color }) => (
            <Octicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicleEntry"
        options={{
          title: 'VehicleEntry',
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus-circle" size={24} color={color} />          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="parking" size={24} color={color} />          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
); }