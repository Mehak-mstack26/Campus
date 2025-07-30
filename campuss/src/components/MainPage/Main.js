import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MentorBookingApp = () => {
  const navigate = useNavigate();
  const [selectedSlots, setSelectedSlots] = useState({});
  const [bookings, setBookings] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('your scheduled time');
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [onlineStatuses, setOnlineStatuses] = useState({});

  // Mock data for mentors
  const mentors = [
    {
      id: 'anuj',
      uid: 'ANUJ_MENTOR_UID_HERE',
      name: 'Anuj Kumar',
      image: '/assests/images/anuj.jpeg',
      description: 'He leads the software development group and is skilled in both frontend and backend development'
    },
    {
      id: 'vivekananda',
      uid: 'VIVEKANANDA_MENTOR_UID_HERE',
      name: 'Vivekananda',
      image: '/assests/images/vivekananda.png',
      description: 'He consistently holds the top spot in class rankings and leaderboard, while actively engaging in the 100 days of coding challenge.'
    },
    {
      id: 'mehak',
      uid: '5BeyClhNG5OJhugUkxifzzJWeGI3',
      name: 'Mehak Jain',
      image: '/assests/images/mehak.png',
      description: "She's presently engaged in GSoC and shares insights on open-source opportunities."
    },
    {
      id: 'ankush',
      uid: 'ANKUSH_MENTOR_UID_HERE',
      name: 'Ankush',
      image: '/assests/images/ankush.jpeg',
      description: 'He informs about clubs and showcases campus highlights.'
    },
    {
      id: 'priyanshu',
      uid: 'PRIYANSHU_MENTOR_UID_HERE',
      name: 'Priyanshu',
      image: '/assests/images/priyanshu.jpg',
      description: 'He recently cleared the ICPC regionals and possesses strong competitive coding skills.'
    },
    {
      id: 'aman',
      uid: 'AMAN_KUMAR_MENTOR_UID_HERE',
      name: 'Aman Kumar',
      image: '/assests/images/aman.jpeg',
      description: 'He provides insights of robotics club features and campus highlights.'
    },
    {
      id: 'janhvi',
      uid: 'JANHVI_MENTOR_UID_HERE',
      name: 'Janhvi',
      image: '/assests/images/janhvi.jpg',
      description: 'She provides information about clubs and offers thorough explanations of faculties.'
    },
    {
      id: 'rachit',
      uid: 'RACHIT_MENTOR_UID_HERE',
      name: 'Rachit',
      image: '/assests/images/rachit.jpg',
      description: 'He excels on Codeforces and keeps you informed about its competitions.'
    },
    {
      id: 'vaiditya',
      uid: 'VAIDITYA_MENTOR_UID_HERE',
      name: 'Vaiditya',
      image: '/assests/images/vaiditya.jpg',
      description: 'He is proficient in multiple coding languages including Python, C++, Java, JavaScript, HTML, CSS, and more, providing assistance as needed.'
    },
    {
      id: 'dally',
      uid: 'DALLY_MENTOR_UID_HERE',
      name: 'Dally',
      image: '/assests/images/dally.jpg',
      description: "She is a skilled explorer who enlightens you about the campus's available opportunities."
    },
    {
      id: 'manshu',
      uid: 'MANSHU_MENTOR_UID_HERE',
      name: 'Manshu',
      image: '/assests/images/manshu.jpg',
      description: 'He has a good grasp of coding and excels in peer learning.'
    },
    {
      id: 'saloni',
      uid: 'SALONI_MENTOR_UID_HERE',
      name: 'Saloni',
      image: '/assests/images/saloni.jpg',
      description: 'Provides guidance on pre-college study options to enhance future prospects.'
    }
  ];

  const timeSlots = ['4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM'];

  // Mock online status simulation
  useEffect(() => {
    const statuses = {};
    mentors.forEach(mentor => {
      statuses[mentor.id] = Math.random() > 0.5; // Random online/offline status
    });
    setOnlineStatuses(statuses);

    // Simulate status changes
    const interval = setInterval(() => {
      const newStatuses = {};
      mentors.forEach(mentor => {
        newStatuses[mentor.id] = Math.random() > 0.3; // 70% chance of being online
      });
      setOnlineStatuses(newStatuses);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSlotSelection = (mentorId, timeSlot) => {
    setSelectedSlots(prev => ({
      ...prev,
      [mentorId]: timeSlot
    }));
  };

  const handleBooking = (mentor) => {
    const selectedSlot = selectedSlots[mentor.id];
    if (!selectedSlot) {
      alert('Please select a time slot before booking.');
      return;
    }

    const bookingKey = `${mentor.id}_${selectedSlot.replace(':', '')}`;
    if (bookings[bookingKey]) {
      alert('This time slot is already booked or unavailable. Please choose another.');
      return;
    }

    const bookingData = {
      name: mentor.name,
      time: selectedSlot,
      timestamp: Date.now()
    };

    setBookings(prev => ({
      ...prev,
      [bookingKey]: bookingData
    }));

    setScheduledTime(`${selectedSlot} with ${mentor.name}`);
    setPopupData({
      name: mentor.name,
      time: selectedSlot
    });
    setShowPopup(true);

    // Clear selection after booking
    setSelectedSlots(prev => ({
      ...prev,
      [mentor.id]: null
    }));

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleChatWithMentor = (mentorUid, mentorName) => {
    // Mock authentication check
    const isAuthenticated = true; // Replace with actual auth check
    
    if (!isAuthenticated) {
      alert('Please sign in as a student to start a chat.');
      return;
    }

    if (!mentorUid || mentorUid.includes('ACTUAL_') || mentorUid.includes('_UID_HERE')) {
      alert('Mentor information is not correctly configured for this chat button.');
      return;
    }

    // Navigate to chat page with mentor information
    navigate('/chat', { 
      state: { 
        mentorUid: mentorUid, 
        mentorName: mentorName 
      } 
    });
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleJoinMeeting = () => {
    window.open('https://muffanuj.github.io/video-meet-app/', '_blank');
  };

  const handleBackToHome = () => {
    navigate('/app'); // Navigate to the home page route
  };

  const getOnlineStatusColor = (mentorId, mentorUid) => {
    if (mentorUid && (mentorUid.includes('ACTUAL_') || mentorUid.includes('_UID_HERE'))) {
      return 'orange';
    }
    return onlineStatuses[mentorId] ? 'limegreen' : 'tomato';
  };

  const getOnlineStatusTitle = (mentorId, mentorUid) => {
    if (mentorUid && (mentorUid.includes('ACTUAL_') || mentorUid.includes('_UID_HERE'))) {
      return 'UID Not Configured';
    }
    return onlineStatuses[mentorId] ? 'Online' : 'Offline';
  };

  return (
    <div style={{ backgroundColor: 'black', padding: '20px', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-100px', paddingLeft: '50px', width: '100%', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center', marginLeft: '120px', gap: '140px' }}>
          <button 
            onClick={handleBackToHome}
            style={{
            cursor: 'pointer',
            padding: '0.9em 1.4em',
            minWidth: '200px',
            minHeight: '38px',
            fontSize: '1rem',
            fontFamily: '"Segoe UI", system-ui, sans-serif',
            fontWeight: '500',
            transition: '0.8s',
            backgroundSize: '280% auto',
            backgroundImage: 'linear-gradient(325deg, #3A7DE9 0%, #51C2FF 55%, #3A7DE9 90%)',
            border: 'none',
            borderRadius: '0.5em',
            color: 'white',
            boxShadow: '0px 0px 20px rgba(71, 184, 255, 0.5), 0px 5px 5px -1px rgba(58, 125, 233, 0.25), inset 4px 4px 8px rgba(175, 230, 255, 0.5), inset -4px -4px 8px rgba(19, 95, 216, 0.35)',
            whiteSpace: 'nowrap'  // This prevents text wrapping
            }}
            onMouseOver={(e) => e.target.style.backgroundPosition = 'right top'}
            onMouseOut={(e) => e.target.style.backgroundPosition = 'left top'}
            >
            <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i>
            Back to Homepage
            </button>
          <h1 style={{ color: '#51C2FF', margin: 0, fontSize: '2em', fontWeight: 'bold', marginBlockStart: '0.67em', marginBlockEnd: '0.67em', whiteSpace: 'nowrap'}}>Book your slots with your seniors</h1>
        </div>
        
        {/* Notification Bell */}
        <div style={{ position: 'relative', width: '500px', margin: '120px auto 0', marginTop: '15px', marginRight: '-100px' }}>
          <div style={{ position: 'relative', width: '50px', height: '50px', fontSize: '32px', margin: '0 auto', textAlign: 'center', color: '#51C2FF' }}>
            <i className="fas fa-bell" style={{ cursor: 'pointer' }} onClick={toggleDropdown}></i>
          </div>
          
          {showDropdown && (
            <div style={{
              width: '350px',
              height: 'auto',
              background: '#fff',
              borderRadius: '5px',
              boxShadow: '2px 2px 3px rgba(0,0,0,0.125)',
              padding: '15px',
              position: 'absolute',
              top: 'calc(100% + 15px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10000
            }}>
              <div style={{ alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #dbdaff', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignSelf: 'center', flexDirection: 'column', textAlign: 'center', justifyContent: 'center' }}>
                  <p style={{ marginBottom: '5px', color: 'black' }}>
                    You can join your meeting at <span style={{ color: '#51C2FF', marginLeft: '5px' }}>{scheduledTime}</span>
                  </p>
                </div>
                <button 
                  onClick={handleJoinMeeting}
                  style={{
                    background: 'linear-gradient(325deg, #3A7DE9 0%, #51C2FF 55%, #3A7DE9 90%)',
                    border: 'none',
                    borderRadius: '5px',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginTop: '10px'
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          display: 'grid',
          padding: '50px',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4rem',
          alignContent: 'center',
          justifyContent: 'center'
        }}>
          {mentors.map((mentor) => (
            <div key={mentor.id} style={{
              position: 'relative',
              width: '320px',
              height: '460px',
              borderRadius: '14px',
              zIndex: 1111,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Background */}
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                width: '300px',
                height: '440px',
                zIndex: 2,
                background: 'black',
                backdropFilter: 'blur(24px)',
                borderRadius: '10px',
                overflow: 'hidden',
                outline: '2px solid white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                color: 'white',
                textAlign: 'center',
                padding: '5px'
              }}>
                <img 
                  src={mentor.image} 
                  alt={mentor.name}
                  style={{ height: '100px', width: '100px', borderRadius: '50%' }}
                />
                <h3 style={{  fontSize: '1.17em', fontWeight: 'bold', display: 'block', marginBlockStart: '1em',
    marginBlockEnd: '1em', marginInlineStart: '0px',marginInlineEnd: '0px'}}>
                  {mentor.name}
                  <span 
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginLeft: '8px',
                      border: '1px solid #fff',
                      verticalAlign: 'middle',
                      backgroundColor: getOnlineStatusColor(mentor.id, mentor.uid)
                    }}
                    title={getOnlineStatusTitle(mentor.id, mentor.uid)}
                  ></span>
                </h3>
                <p style={{ fontSize: '14px', marginTop: '-10px', color: '#51C2FF', marginBottom: '20px', lineHeight: '1.2'  }}>
                  {mentor.description}
                </p>
                
                {/* Time Slots */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginLeft: '12px'
                  }}>
                    {timeSlots.map((slot, index) => {
                      const isSelected = selectedSlots[mentor.id] === slot;
                      const bookingKey = `${mentor.id}_${slot.replace(':', '')}`;
                      const isBooked = bookings[bookingKey];
                      
                      return (
                        <label 
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px',
                            border: '1px solid #ccc',
                            backgroundColor: isSelected ? 'royalblue' : '#212121',
                            borderRadius: '5px',
                            marginRight: '12px',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            position: 'relative',
                            transition: 'all 0.3s ease-in-out',
                            opacity: isBooked ? 0.5 : 1,
                            borderColor: isSelected ? 'rgb(129, 235, 129)' : '#ccc'
                          }}
                          onClick={() => !isBooked && handleSlotSelection(mentor.id, slot)}
                        >
                          <div style={{
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: isSelected ? '0' : '50%',
                            left: '0',
                            transform: isSelected ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'green' : '#fff',
                            border: '2px solid #ccc',
                            transition: 'all 0.3s ease-in-out'
                          }} />
                          <span style={{ marginLeft: '15px', textAlign: 'center' }}>{slot}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleBooking(mentor)}
                    style={{
                      cursor: 'pointer',
                      padding: '0.9em 1.4em',
                      minWidth: '110px',
                      minHeight: '38px',
                      fontSize: '1rem',
                      fontFamily: '"Segoe UI", system-ui, sans-serif',
                      fontWeight: '500',
                      transition: '0.8s',
                      backgroundSize: '280% auto',
                      backgroundImage: 'linear-gradient(325deg, #3A7DE9 0%, #51C2FF 55%, #3A7DE9 90%)',
                      border: 'none',
                      borderRadius: '0.5em',
                      color: 'white',
                      boxShadow: '0px 0px 20px rgba(71, 184, 255, 0.5), 0px 5px 5px -1px rgba(58, 125, 233, 0.25), inset 4px 4px 8px rgba(175, 230, 255, 0.5), inset -4px -4px 8px rgba(19, 95, 216, 0.35)'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundPosition = 'right top'}
                    onMouseOut={(e) => e.target.style.backgroundPosition = 'left top'}
                  >
                    Book
                  </button>
                  <button 
                    onClick={() => handleChatWithMentor(mentor.uid, mentor.name)}
                    style={{
                      cursor: 'pointer',
                      padding: '0.9em 1.4em',
                      minWidth: '110px',
                      minHeight: '38px',
                      fontSize: '1rem',
                      fontFamily: '"Segoe UI", system-ui, sans-serif',
                      fontWeight: '500',
                      transition: '0.8s',
                      backgroundSize: '280% auto',
                      backgroundImage: 'linear-gradient(325deg, #3A7DE9 0%, #51C2FF 55%, #3A7DE9 90%)',
                      border: 'none',
                      borderRadius: '0.5em',
                      color: 'white',
                      boxShadow: '0px 0px 20px rgba(71, 184, 255, 0.5), 0px 5px 5px -1px rgba(58, 125, 233, 0.25), inset 4px 4px 8px rgba(175, 230, 255, 0.5), inset -4px -4px 8px rgba(19, 95, 216, 0.35)'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundPosition = 'right top'}
                    onMouseOut={(e) => e.target.style.backgroundPosition = 'left top'}
                  >
                    Chat
                  </button>
                </div>
              </div>
              
              {/* Animated Blob */}
              <div style={{
                position: 'absolute',
                zIndex: 1,
                top: '50%',
                left: '50%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                backgroundColor: '#51C2FF',
                opacity: 1,
                filter: 'blur(12px)',
                animation: 'blob-bounce 5s infinite ease'
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {/* {showPopup && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          height: '300px',
          width: '450px',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          borderRadius: '5px',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className="fa-regular fa-circle-check" style={{ color: 'green', fontSize: '70px', marginBottom: '30px' }}></i>
          <p style={{ margin: '10px 0', textAlign: 'center', fontSize: '20px', fontFamily: 'Spartan, sans-serif', color: 'black' }}>
            Your Booking is <strong>CONFIRMED</strong> with {popupData.name}
          </p>
          <hr style={{ width: '100%', margin: '10px 0' }} />
          <p style={{ margin: '10px 0', textAlign: 'center', fontSize: '20px', fontFamily: 'Spartan, sans-serif', color: 'black' }}>
            <strong>Your meeting is booked at </strong>{popupData.time}
          </p>
          <hr style={{ width: '100%', margin: '10px 0' }} />
          <p style={{ margin: '10px 0', textAlign: 'center', fontSize: '20px', fontFamily: 'Spartan, sans-serif', color: 'black' }}>
            <strong>See you soon!</strong>
          </p>
        </div>
      )} */}

      {showPopup && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000
  }}>
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '40px 30px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      border: '1px solid #e0e0e0'
    }}>
      {/* Success Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#4CAF50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '25px'
      }}>
        <i className="fa-solid fa-check" style={{ 
          color: 'white', 
          fontSize: '40px' 
        }}></i>
      </div>

      {/* Main heading */}
      <h2 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '24px', 
        fontFamily: 'Spartan, sans-serif', 
        color: '#333',
        fontWeight: '600'
      }}>
        Booking Confirmed!
      </h2>

      {/* Confirmation message */}
      <p style={{ 
        margin: '0 0 25px 0', 
        fontSize: '16px', 
        fontFamily: 'Spartan, sans-serif', 
        color: '#666',
        lineHeight: '1.5'
      }}>
        Your session with <strong style={{ color: '#333' }}>{popupData.name}</strong> has been successfully booked.
      </p>

      {/* Meeting details box */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '20px',
        width: '100%',
        marginBottom: '25px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px'
        }}>
          <i className="fa-regular fa-clock" style={{ 
            color: '#4CAF50', 
            fontSize: '18px', 
            marginRight: '10px' 
          }}></i>
          <span style={{ 
            fontSize: '18px', 
            fontFamily: 'Spartan, sans-serif', 
            color: '#333',
            fontWeight: '600'
          }}>
            {popupData.time}
          </span>
        </div>
      </div>

      {/* Footer message */}
      <p style={{ 
        margin: '0', 
        fontSize: '16px', 
        fontFamily: 'Spartan, sans-serif', 
        color: '#4CAF50',
        fontWeight: '600'
      }}>
        See you soon! 🎉
      </p>

      {/* Close button (optional) */}
      <button 
        onClick={() => setShowPopup(false)}
        style={{
          marginTop: '20px',
          padding: '10px 25px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontFamily: 'Spartan, sans-serif',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Got it!
      </button>
    </div>
  </div>
)}

      {/* CSS Animations */}
      <style>{`
        @keyframes blob-bounce {
          0% {
            transform: translate(-100%, -100%) translate3d(0, 0, 0);
          }
          25% {
            transform: translate(-100%, -100%) translate3d(100%, 0, 0);
          }
          50% {
            transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
          }
          75% {
            transform: translate(-100%, -100%) translate3d(0, 100%, 0);
          }
          100% {
            transform: translate(-100%, -100%) translate3d(0, 0, 0);
          }
        }

        @keyframes radio-translate {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @media only screen and (max-width: 700px) {
          .card-grid {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MentorBookingApp;