import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { 
  RiUserLine, RiMailLine, RiShieldUserLine, RiTimeLine, RiEditLine, 
  RiPhoneLine, RiMapPinLine, RiBriefcaseLine, RiCalendarLine, RiUserHeartLine, RiMoneyDollarCircleLine 
} from 'react-icons/ri'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'

const Profile = () => {
  const { user, role } = useAuthStore()
  const { isDark } = useThemeStore()

  const sections = [
    {
      title: 'Personal Details',
      items: [
        { label: 'Full Name', value: user?.name || 'N/A', icon: RiUserLine },
        { label: 'Email Address', value: user?.email || 'N/A', icon: RiMailLine },
        { label: 'Contact Number', value: user?.contactNumber || 'N/A', icon: RiPhoneLine },
        { label: 'Date of Birth', value: user?.dateOfBirth || 'N/A', icon: RiCalendarLine },
        { label: 'Gender', value: user?.gender || 'N/A', icon: RiUserHeartLine },
      ]
    },
    {
      title: 'Address Information',
      items: [
        { label: 'Current Address', value: user?.currentAddress || 'N/A', icon: RiMapPinLine },
        { label: 'Permanent Address', value: user?.permanentAddress || 'N/A', icon: RiMapPinLine },
      ]
    },
    {
      title: 'Employment & Financials',
      items: [
        { label: 'Occupation', value: user?.occupation || 'N/A', icon: RiBriefcaseLine },
        { label: 'Employer Name', value: user?.employerName || 'N/A', icon: RiBriefcaseLine },
        { label: 'Monthly Income', value: user?.income ? `₹${user.income}` : 'N/A', icon: RiMoneyDollarCircleLine },
        { label: 'Work Experience', value: user?.workExperience ? `${user.workExperience} Years` : 'N/A', icon: RiTimeLine },
      ]
    }
  ]

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information and account settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* Left: Avatar & Quick Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-1 rounded-3xl p-6 text-center flex flex-col items-center h-fit ${
            isDark ? 'glass-card' : 'glass-card-light shadow-sm border border-slate-200'
          }`}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl mb-4"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
          >
            {user?.name?.[0] || role?.[0] || 'U'}
          </div>
          <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {user?.name || 'Valued User'}
          </h3>
          <p className="text-xs text-blue-500 font-bold mt-1 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded">{role}</p>
          
          <div className="w-full h-px bg-slate-200 dark:bg-white/10 my-6" />
          
          <div className="space-y-3 w-full">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
              <span>KYC Verified</span>
              <span className="text-blue-500">Yes</span>
            </div>
          </div>

          <Button className="w-full mt-8" variant="secondary" size="sm" icon={RiEditLine}>
            Edit Profile
          </Button>
        </motion.div>

        {/* Right: Detailed Info Sections */}
        <div className="lg:col-span-3 space-y-6">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-3xl p-6 ${
                isDark ? 'glass-card' : 'glass-card-light shadow-sm border border-slate-200'
              }`}
            >
              <h4 className={`text-sm font-bold mb-5 uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                {section.title}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {section.items.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.label}
                    </label>
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/05' : 'bg-slate-100'}`}>
                        <item.icon size={14} className="text-blue-500" />
                      </div>
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Security Settings Quick Look */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-3xl p-6 ${
              isDark ? 'glass-card' : 'glass-card-light shadow-sm border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Security Status</h4>
                <p className="text-xs text-slate-500 mt-1">Two-factor authentication is active on your account.</p>
              </div>
              <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-widest">
                <RiShieldUserLine size={18} />
                Secure
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
