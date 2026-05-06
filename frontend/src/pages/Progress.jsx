import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Zap, LineChart, HeartPulse, Activity } from 'lucide-react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Filler,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../context/AuthContext.jsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


ChartJS.register(Filler, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend);

const Progress = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    setTimeout(() => {
      setProgressData([
        { date: 'Jan 1', weight: 82.5, bodyfat: 24.5, caloriesIn: 2400, caloriesOut: 2100 },
        { date: 'Jan 8', weight: 81.2, bodyfat: 23.8, caloriesIn: 2280, caloriesOut: 2350 },
        { date: 'Jan 15', weight: 79.8, bodyfat: 22.9, caloriesIn: 2150, caloriesOut: 2550 },
        { date: 'Jan 22', weight: 78.5, bodyfat: 22.1, caloriesIn: 2050, caloriesOut: 2720 },
        { date: 'Jan 29', weight: 77.2, bodyfat: 21.2, caloriesIn: 1980, caloriesOut: 2850 },
      ]);
      setLoading(false);
    }, 1200);
  };

  const weightChartData = {
    labels: progressData.map(p => p.date),
    datasets: [{
      label: 'Weight (kg)',
      data: progressData.map(p => p.weight),
      borderColor: '#1E3A8A',
      backgroundColor: 'rgba(30, 58, 138, 0.15)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: progressData.map((_, i) => i === progressData.length - 1 ? '#10B981' : '#1E3A8A'),
      pointBorderColor: '#ffffff',
      pointBorderWidth: 3,
      pointRadius: 6
    }]
  };

  const macroData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [38, 45, 17],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderWidth: 0,
      borderRadius: 12
    }]
  };

  const performanceData = {
    labels: ['Strength', 'Endurance', 'Flexibility', 'Recovery'],
    datasets: [{
      data: [85, 78, 92, 88],
      backgroundColor: 'rgba(16, 185, 129, 0.3)',
      borderColor: 'rgba(16, 185, 129, 1)',
      pointBackgroundColor: 'rgba(16, 185, 129, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(16, 185, 129, 1)'
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-4 border-slate-200 border-t-slate-600 rounded-full"
        />
      </div>
    );
  }

  const handleExportFullReport = async () => {
    const elementId = 'report-section';
    const el = document.getElementById(elementId);
    if (!el) {
      console.error(`Export failed: element #${elementId} not found`);
      alert('Could not find report section to export.');
      return;
    }

    try {
      // Wait a tick so charts finish rendering (especially with tab changes)
      await new Promise((r) => setTimeout(r, 300));

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        windowWidth: el.scrollWidth,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let position = 0;
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multi-page addImage with cropping by shifting Y position
        const totalHeight = imgHeight;
        while (position < totalHeight) {
          pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
          position += pageHeight;
          if (position < totalHeight) pdf.addPage();
        }
      }

      pdf.save(`fitness-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Export Full Report failed:', err);
      alert('Failed to export PDF. Check console for details.');
    }
  };

  return (
    <div className="space-y-12">
      {/* Report wrapper (used by PDF export) */}
      <div id="report-section">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page flex flex-col items-start gap-2 mb-6"
        >
          <div className="flex flex-col items-start gap-2 mb-6">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight">Progress Intelligence</h1>
            <p className="text-gray-500 text-lg">Data-driven insights from your fitness journey</p>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 mt-4">

              {['overview', 'weight', 'performance', 'prediction'].map((t) => (

                <motion.button
                  key={t}
                  onClick={() => setTab(t)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${tab === t 
                    ? 'bg-gradient-to-r from-emerald-600 to-slate-600 text-white shadow-emerald-500/50' 
                    : 'bg-white/70 dark:bg-slate-800/70 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-200 text-slate-700'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>




      {/* Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl shadow-lg border bg-white">
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="w-12 h-12 text-emerald-500" />
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">Weight Evolution</h3>
                <p className="text-lg text-muted-foreground">5.3kg lost • Excellent pace</p>
              </div>
            </div>
            <div className="h-[300px]">
              <Line data={weightChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }} />
            </div>
          </div>
          <div className="p-6 rounded-2xl shadow-lg border bg-gradient-to-br from-emerald-500/10 to-slate-500/10">
            <div className="flex items-center gap-4 mb-6">
              <Activity className="w-12 h-12 text-amber-500" />
              <div>
                <h3 className="text-2xl font-bold mb-1">Macro Mastery</h3>
                <p className="text-lg text-muted-foreground">Perfect nutrition balance</p>
              </div>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut data={macroData} options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%'
              }} />
            </div>
          </div>
        </div>
      )}

      <div className="p-6 rounded-2xl shadow-lg border bg-white">
        <div className="flex items-center gap-6 mb-8">
          <HeartPulse className="w-14 h-14 text-emerald-500 p-4 bg-emerald-100 rounded-3xl shadow-xl" />
          <div>
            <h3 className="text-4xl font-bold mb-2">Fitness Radar</h3>
            <p className="text-lg font-semibold text-muted-foreground">Your comprehensive performance matrix</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="h-[400px]">
            <Radar data={performanceData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} />
          </div>
          <div className="space-y-6 text-left lg:pr-6">
            <div className="flex items-center justify-center lg:justify-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-slate-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-5xl font-black text-emerald-600 mb-2">92%</div>
                <p className="text-2xl font-bold text-muted-foreground">Overall Score</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-b from-emerald-500/20 rounded-xl border border-emerald-200/50">
                <div className="text-3xl font-black text-emerald-600 mb-2">Strength</div>
                <div className="text-2xl">+12% ↑</div>
              </div>
              <div className="p-6 bg-gradient-to-b from-slate-500/20 rounded-xl border border-slate-200/50">
                <div className="text-3xl font-black text-slate-600 mb-2">Endurance</div>
                <div className="text-2xl">+8% ↑</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-gradient-to-r from-slate-600 to-emerald-500 text-white rounded-2xl shadow-2xl text-center"
      >
        <Zap className="w-24 h-24 mx-auto mb-8 opacity-75 animate-pulse" />
        <h2 className="text-4xl font-black mb-6 drop-shadow-lg">AI Future Prediction</h2>
        <div className="text-2xl font-bold mb-6 drop-shadow-lg">8 Weeks to Goal</div>
        <p className="text-xl opacity-95 max-w-3xl mx-auto mb-8 leading-relaxed">
          Machine learning models predict you'll reach target weight with current trajectory. 
        </p>
        <motion.button
          type="button"
          onClick={() => {
            console.log('Export Full Report clicked');
            handleExportFullReport();
          }}
          whileHover={{ scale: 1.05 }}
          className="bg-white text-slate-700 font-bold py-4 px-12 rounded-2xl text-xl shadow-2xl hover:shadow-lg transition-all"
        >
          Export Full Report 📊
        </motion.button>
      </motion.div>
      </div>
    </div>
  );
};

export default Progress;

