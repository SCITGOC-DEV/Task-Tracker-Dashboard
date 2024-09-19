import React from "react";
import {ScrollView} from "react-native-web";
import BarChartComponent from "../components/BarChart";
import PieChartComponent from "../components/PieChart";

const Dashboard = () => {
   return (
      <ScrollView className="flex-1 bg-white">
        <BarChartComponent />
      </ScrollView>
  );
};

export default Dashboard;
