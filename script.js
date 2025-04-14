document.addEventListener('DOMContentLoaded', () => {
    console.log('منصة بشمهندس ميدو جاهزة!');

    // --- Global variable to store course data ---
    let allCoursesData = null;

    // --- Constants ---
    const ADMIN_EMAIL = "mohmedshalaby246@gamil.com"; // Using email as username for admin
    const ADMIN_PASSWORD = "medooshalaby";

    // --- Helper Functions for LocalStorage ---
    const getStoredData = (key, defaultValue) => {
       try {
           const data = localStorage.getItem(key);
           return data ? JSON.parse(data) : defaultValue;
       } catch (e) {
           console.error("Error reading from localStorage", key, e);
           return defaultValue;
       }
    };

    const setStoredData = (key, data) => {
       try {
           localStorage.setItem(key, JSON.stringify(data));
       } catch (e) {
           console.error("Error writing to localStorage", key, e);
       }
    };

    // --- Login Page Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent actual form submission for now
            console.log('Login form submitted');

            const usernameInput = document.getElementById('username').value; // Use different var name
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            let loginSuccess = false;
            let userApproved = true; // Assume approved unless checked otherwise
            let actualUsername = usernameInput; // Use input username by default

            // Use ADMIN_EMAIL for login check if role is admin
            const loginIdentifier = (role === 'admin') ? usernameInput : usernameInput;

            if (role === 'admin') {
                // Hardcoded admin check (using email as username)
                if (loginIdentifier === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    loginSuccess = true;
                    actualUsername = "Admin"; // Set a display name for admin
                } else {
                     alert('بيانات دخول المدير غير صحيحة.');
                     loginSuccess = false; // Ensure login fails
                }
            } else if (role === 'student') {
                // --- Final Student Login Logic ---
                const studentUsername = usernameInput; // Login uses username now
                const enteredPassword = password; // Get entered password
                const pendingRequests = getStoredData('pendingAccountRequests', []);
                const approvedUsers = getStoredData('approvedUsers', []);

                // Check if username is pending
                const isPending = pendingRequests.some(user => user.username === studentUsername);
                // Find user in approved list by username
                const approvedUser = approvedUsers.find(user => user.username === studentUsername);

                if (isPending) {
                    alert('حسابك قيد المراجعة والموافقة من قبل المدير.');
                    loginSuccess = false;
                    userApproved = false;
                } else if (approvedUser) {
                    // Check if the password matches
                    if (approvedUser.password === enteredPassword) {
                        loginSuccess = true;
                        userApproved = true;
                        actualUsername = approvedUser.username; // Use the stored username
                    } else {
                        alert('كلمة المرور غير صحيحة.');
                        loginSuccess = false;
                        userApproved = true; // User is approved, but password wrong
                    }
                } else {
                    // Not found in pending or approved
                    alert('اسم المستخدم غير مسجل أو لم تتم الموافقة عليه بعد.');
                    loginSuccess = false;
                    userApproved = false;
                }
            } else if (role === 'instructor') {
                // --- Instructor Login Logic (similar to student) ---
                const instructorUsername = usernameInput; // Login uses username
                const enteredPassword = password; // Get entered password
                const pendingRequests = getStoredData('pendingAccountRequests', []);
                const approvedUsers = getStoredData('approvedUsers', []);

                // Check if username is pending (should have role 'instructor')
                const isPending = pendingRequests.some(user => user.username === instructorUsername && user.role === 'instructor');
                // Find user in approved list by username (should have role 'instructor')
                const approvedUser = approvedUsers.find(user => user.username === instructorUsername && user.role === 'instructor');

                if (isPending) {
                    alert('حسابك كمدرب قيد المراجعة والموافقة من قبل المدير.');
                    loginSuccess = false;
                    userApproved = false;
                } else if (approvedUser) {
                    // Check if the password matches
                    if (approvedUser.password === enteredPassword) {
                        loginSuccess = true;
                        userApproved = true;
                        actualUsername = approvedUser.username; // Use the stored username
                    } else {
                        alert('كلمة المرور غير صحيحة.');
                        loginSuccess = false;
                        userApproved = true; // User is approved, but password wrong
                    }
                } else {
                    // Not found in pending or approved with instructor role
                    alert('اسم المستخدم كمدرب غير مسجل أو لم تتم الموافقة عليه بعد.');
                    loginSuccess = false;
                    userApproved = false;
                }
            } else {
                 // Handle unexpected role values from login dropdown
                 alert('الدور المحدد غير صالح.');
                 loginSuccess = false;
                 userApproved = false;
            }

            if (loginSuccess && userApproved) {
                console.log(`Login successful for ${actualUsername} as ${role}`);
                localStorage.setItem('userRole', role);
                // Store the actual username (could be "Admin" or the input username)
                localStorage.setItem('username', actualUsername);
                window.location.href = 'dashboard.html';
            } else if (loginSuccess && !userApproved) {
                // Do nothing, alert already shown
                console.log(`Login attempt for pending account: ${loginIdentifier}`);
            } else {
                // Handle cases where user is not found or other errors if needed
                console.log(`Login failed (wrong credentials): ${loginIdentifier}`);
            }
        });
    }

    // --- Section Switching Logic ---
    const loginSection = document.getElementById('login');
    const registerSection = document.getElementById('register');
    const forgotPasswordSection = document.getElementById('forgot-password');
    const hiddenClass = 'hidden-section'; // CSS class to hide elements

    // Link: Show Register Section
    const showRegisterLink = document.getElementById('show-register-link');
    if (showRegisterLink && loginSection && registerSection && forgotPasswordSection) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("--- Show Register Click ---");
            loginSection.classList.add(hiddenClass);
            forgotPasswordSection.classList.add(hiddenClass);
            registerSection.classList.remove(hiddenClass);
            console.log("Login hidden, Register shown");
        });
    }

    // Link: Show Login Section (from Register page)
    const showLoginLinkFromRegister = document.getElementById('show-login-link-from-register');
    if (showLoginLinkFromRegister && loginSection && registerSection) {
        showLoginLinkFromRegister.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("--- Show Login from Register Click ---");
            registerSection.classList.add(hiddenClass);
            // Ensure forgot password is also hidden if it was somehow visible
            if (forgotPasswordSection) forgotPasswordSection.classList.add(hiddenClass);
            loginSection.classList.remove(hiddenClass);
            console.log("Register hidden, Login shown");
        });
    }

    // Link: Show Forgot Password Section
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink && loginSection && registerSection && forgotPasswordSection) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("--- Show Forgot Password Click ---");
            loginSection.classList.add(hiddenClass);
            registerSection.classList.add(hiddenClass);
            forgotPasswordSection.classList.remove(hiddenClass);
            // Reset forgot password form to step 1 (still using display style here is ok)
            const step1Form = document.getElementById('forgot-password-form-step1');
            const step2Form = document.getElementById('forgot-password-form-step2');
            if(step1Form) step1Form.style.display = 'block';
            if(step2Form) step2Form.style.display = 'none';
            console.log("Login/Register hidden, Forgot Password shown");
        });
    }

    // Links: Show Login Section (from Forgot Password page)
    const showLoginLinkFromForgot = document.getElementById('show-login-link-from-forgot');
    const showLoginLinkFromForgot2 = document.getElementById('show-login-link-from-forgot2');
    const backToLoginAction = (e) => {
        e.preventDefault();
        console.log("--- Show Login from Forgot Click ---");
        if (forgotPasswordSection) forgotPasswordSection.classList.add(hiddenClass);
        // Ensure register is also hidden if it was somehow visible
        if (registerSection) registerSection.classList.add(hiddenClass);
        if (loginSection) loginSection.classList.remove(hiddenClass);
        console.log("Forgot Password hidden, Login shown");
    };
    if (showLoginLinkFromForgot) {
        showLoginLinkFromForgot.addEventListener('click', backToLoginAction);
    }
     if (showLoginLinkFromForgot2) {
        showLoginLinkFromForgot2.addEventListener('click', backToLoginAction);
    }
    // --- End Section Switching Logic ---


    // --- Registration Form Submit Logic ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent actual form submission
            console.log('New registration form submitted with username/age/email/password');

            const username = document.getElementById('reg-username').value;
            const age = document.getElementById('reg-age').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const role = document.getElementById('reg-role').value; // Get selected role


            // Basic validation
            if (!username || !age || !email || !password || !role) { // Added role validation
                alert('يرجى ملء جميع الحقول.');
                return;
            }
            if (parseInt(age) <= 0) {
                 alert('يرجى إدخال عمر صحيح.');
                 return;
            }

            // Retrieve existing pending and approved users (assuming approvedUsers store similar structure)
            let pendingAccountRequests = getStoredData('pendingAccountRequests', []);
            let approvedUsers = getStoredData('approvedUsers', []);

            // Check if the username OR email already exists
            const usernameExists = pendingAccountRequests.some(user => user.username === username) || approvedUsers.some(user => user.username === username);
            const emailExists = pendingAccountRequests.some(user => user.email === email) || approvedUsers.some(user => user.email === email);

            if (usernameExists) {
                alert('اسم المستخدم هذا مسجل بالفعل أو قيد المراجعة.');
                return; // Stop registration
            }
            if (emailExists) {
                 alert('هذا البريد الإلكتروني مسجل بالفعل أو قيد المراجعة.');
                 return; // Stop registration
            }


            // Create a new pending user account object with all fields including selected role
            const newPendingUser = {
                username: username,
                age: age,
                email: email,
                password: password, // Storing password directly (consider hashing in a real app)
                role: role, // Use the selected role
                requestDate: new Date().toISOString()
            };

            // Add the new user to the pending requests array
            pendingAccountRequests.push(newPendingUser);

            // Store the updated pending requests array in localStorage
            setStoredData('pendingAccountRequests', pendingAccountRequests);

            // Inform the user their request is pending, mentioning the role
            console.log(`Account request submitted for username ${username} as ${role}. Pending admin approval.`);
            alert(`تم استلام طلب إنشاء الحساب للمستخدم ${username} بدور ${role === 'student' ? 'طالب' : 'مدرس'}.\nسيتم مراجعته من قبل المدير.`);

            // Optionally, switch back to the login form after registration attempt
            if (registerSection) registerSection.classList.add(hiddenClass); // Hide register
            if (loginSection) loginSection.classList.remove(hiddenClass); // Show login
            registerForm.reset(); // Clear the form fields
        });
    }

     // --- Dashboard Page Logic ---
     const dashboardContent = document.getElementById('dashboard-content');
     if (dashboardContent) {
        const userRole = localStorage.getItem('userRole');
        const username = localStorage.getItem('username') || 'المستخدم'; // Get username or default

        // Update welcome message
        const welcomeHeading = document.querySelector('main h2');
        if (welcomeHeading) {
            welcomeHeading.textContent = `مرحباً بك، ${username}!`;
        }

         // Show the correct dashboard section based on the stored role
         if (userRole) {
             const adminDashboard = document.getElementById('admin-dashboard');
             const instructorDashboard = document.getElementById('instructor-dashboard');
             const studentDashboard = document.getElementById('student-dashboard');

             // Hide all dashboards first
             if(adminDashboard) adminDashboard.style.display = 'none';
             if(instructorDashboard) instructorDashboard.style.display = 'none';
             if(studentDashboard) studentDashboard.style.display = 'none';

             // --- Admin Specific Logic ---
             if (userRole === 'admin' && adminDashboard) {
                 adminDashboard.style.display = 'block';
                 displayPendingRequests(); // Display pending COURSE enrollment requests
                 setupAdminActionButtons(); // Handle COURSE enrollment actions
                 displayPendingAccountRequests(); // Display pending ACCOUNT creation requests
                 setupAdminAccountActionButtons(); // Handle ACCOUNT creation actions
                 displayPendingDiscussionPosts(); // Display pending DISCUSSION posts
                 setupAdminDiscussionActionButtons(); // Handle DISCUSSION post actions
                  populateCertificateUserDropdown(); // Populate user list for certificates
                  setupCertificateAssignmentForm(); // Handle certificate assignment
                  populateEnrollmentUserDropdown(); // Populate user list for enrollment management
                  setupEnrollmentManagement(); // Setup listeners for the new section
              }
              // --- Instructor Specific Logic ---
             else if (userRole === 'instructor' && instructorDashboard) {
                 instructorDashboard.style.display = 'block';
                 // Add instructor specific logic here later
             }
             // --- Student Specific Logic ---
             else if (userRole === 'student' && studentDashboard) {
                 studentDashboard.style.display = 'block';
                 setupEnrollmentRequestButtons(username); // Pass username
                 displayEnrolledCourses(username); // Show courses student is enrolled in
                 updateAvailableCourseButtons(username); // Disable buttons if requested/enrolled
             } else {
                  // Fallback if role is unknown or element doesn't exist
                  dashboardContent.querySelector('p').textContent = 'لم يتم التعرف على دور المستخدم أو حدث خطأ.';
             }
         } else {
             // If no role is found (e.g., user accessed dashboard directly)
              dashboardContent.querySelector('p').textContent = 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم.';
          }
      }

     // --- Enrollment Request Logic (Student) ---
     function setupEnrollmentRequestButtons(studentUsername) {
         const requestButtons = document.querySelectorAll('.request-enrollment');
         requestButtons.forEach(button => {
             button.addEventListener('click', () => {
                 const courseId = button.dataset.courseId;
                 const courseName = button.dataset.courseName;

                 // Simulate sending request (add to localStorage)
                 let requests = getStoredData('pendingEnrollmentRequests', []);
                 // Prevent duplicate requests from the same user for the same course
                 if (!requests.some(req => req.student === studentUsername && req.courseId === courseId)) {
                     requests.push({ student: studentUsername, courseId: courseId, courseName: courseName });
                     setStoredData('pendingEnrollmentRequests', requests);
                     alert(`تم إرسال طلب التسجيل في "${courseName}".`);
                     button.textContent = 'الطلب معلق';
                     button.disabled = true;
                 } else {
                     alert('لقد قمت بالفعل بطلب التسجيل في هذا الكورس.');
                 }
             });
         });
     }

     // --- Display Enrolled Courses (Student) ---
     function displayEnrolledCourses(studentUsername) {
         const enrolledList = document.getElementById('enrolled-courses-list');
         const noEnrolledMsg = document.getElementById('no-enrolled-courses');
         const enrolledCourses = getStoredData('approvedEnrollments', {})[studentUsername] || []; // Get courses for this student

         enrolledList.innerHTML = ''; // Clear current list (except message)
         enrolledList.appendChild(noEnrolledMsg); // Keep the message element

         if (enrolledCourses.length > 0) {
             noEnrolledMsg.style.display = 'none';
             enrolledCourses.forEach(course => {
                 const listItem = document.createElement('li');
                 // Map courseId to actual name and link
                 let courseLink = '#';
                 let courseDisplayName = course.courseName; // Use stored name
                 // Map course IDs to their respective HTML pages
                 const coursePageMap = {
                     'ai-whiteboard': 'course-ai-whiteboard.html',
                     'misc-videos': 'course-misc-videos.html',
                     'montage': 'course-montage.html',
                     'photoshop': 'course-photoshop.html',
                     'advertising': 'course-advertising.html',
                     'canva': 'course-canva.html',
                     'motion-graphics': 'course-motion-graphics.html'
                 };
                 courseLink = coursePageMap[course.courseId] || '#'; // Use mapped link or fallback
                 listItem.innerHTML = `<a href="${courseLink}">${courseDisplayName}</a>`;
                 enrolledList.appendChild(listItem);
             });
         } else {
             noEnrolledMsg.style.display = 'block';
         }
     }

      // --- Update Available Course Buttons (Student) ---
      function updateAvailableCourseButtons(studentUsername) {
          const availableButtons = document.querySelectorAll('#available-courses-list .request-enrollment');
          const pendingRequests = getStoredData('pendingEnrollmentRequests', []);
          const enrolledCourses = getStoredData('approvedEnrollments', {})[studentUsername] || [];

          availableButtons.forEach(button => {
              const courseId = button.dataset.courseId;
              // Check if already enrolled
              if (enrolledCourses.some(course => course.courseId === courseId)) {
                  button.textContent = 'مسجل بالفعل';
                  button.disabled = true;
              }
              // Check if request is pending
              else if (pendingRequests.some(req => req.student === studentUsername && req.courseId === courseId)) {
                  button.textContent = 'الطلب معلق';
                  button.disabled = true;
              } else {
                  button.textContent = 'طلب تسجيل';
                  button.disabled = false;
              }
          });
      }


     // --- Display Pending Requests (Admin) ---
     function displayPendingRequests() {
         const requestsList = document.getElementById('pending-requests-list');
         const noRequestsMsg = document.getElementById('no-pending-requests');
         const requests = getStoredData('pendingEnrollmentRequests', []);

         // Clear previous list items (keep the 'no requests' message)
         requestsList.innerHTML = '';
         requestsList.appendChild(noRequestsMsg);

         if (requests.length > 0) {
             noRequestsMsg.style.display = 'none';
             requests.forEach((req, index) => {
                 const listItem = document.createElement('li');
                 listItem.innerHTML = `
                     <span>الطالب "${req.student}" يطلب التسجيل في "${req.courseName}"</span>
                     <button class="approve-request" data-index="${index}">موافقة</button>
                     <button class="deny-request" data-index="${index}">رفض</button>
                 `;
                 requestsList.appendChild(listItem);
             });
         } else {
             noRequestsMsg.style.display = 'block';
         }
     }

     // --- Admin Action Buttons Logic ---
     function setupAdminActionButtons() {
         const requestsList = document.getElementById('pending-requests-list');

         requestsList.addEventListener('click', (event) => {
             const target = event.target;
             const index = target.dataset.index;

             if (index === undefined) return; // Clicked somewhere else

             let requests = getStoredData('pendingEnrollmentRequests', []);
             const request = requests[parseInt(index)]; // Get the specific request

             if (!request) return; // Should not happen

             if (target.classList.contains('approve-request')) {
                 // Add to approved list
                 let approvals = getStoredData('approvedEnrollments', {});
                 if (!approvals[request.student]) {
                     approvals[request.student] = []; // Initialize array for the student if not exists
                 }
                 // Add course if not already added
                 if (!approvals[request.student].some(c => c.courseId === request.courseId)) {
                    approvals[request.student].push({ courseId: request.courseId, courseName: request.courseName });
                 }
                 setStoredData('approvedEnrollments', approvals);

                 // Remove from pending
                 requests.splice(index, 1);
                 setStoredData('pendingEnrollmentRequests', requests);

                 alert(`تمت الموافقة على طلب ${request.student}`);

             } else if (target.classList.contains('deny-request')) {
                 // Just remove from pending
                 requests.splice(index, 1);
                 setStoredData('pendingEnrollmentRequests', requests);
                 alert(`تم رفض طلب ${request.student}`);
             }

             // Refresh the list display
             displayPendingRequests();
         });
     }

     // --- Display Pending Account Requests (Admin) ---
     function displayPendingAccountRequests() {
        const accountRequestsList = document.getElementById('pending-account-requests-list');
        const noAccountRequestsMsg = document.getElementById('no-pending-account-requests');
        const requests = getStoredData('pendingAccountRequests', []);

        // Clear previous list items (keep the 'no requests' message)
        accountRequestsList.innerHTML = '';
        accountRequestsList.appendChild(noAccountRequestsMsg);

        if (requests.length > 0) {
            noAccountRequestsMsg.style.display = 'none';
            requests.forEach((req, index) => {
                const listItem = document.createElement('li');
                // Display Username, Age, Email for the admin
                listItem.innerHTML = `
                    <span>طلب حساب: ${req.username} (العمر: ${req.age}, البريد: ${req.email})</span>
                    <button class="approve-account-request" data-index="${index}">موافقة</button>
                    <button class="deny-account-request" data-index="${index}">رفض</button>
                `;
                accountRequestsList.appendChild(listItem);
            });
        } else {
            noAccountRequestsMsg.style.display = 'block';
        }
     }

     // --- Admin Account Action Buttons Logic ---
     function setupAdminAccountActionButtons() {
        const accountRequestsList = document.getElementById('pending-account-requests-list');

        accountRequestsList.addEventListener('click', (event) => {
            const target = event.target;
            const index = target.dataset.index;

            if (index === undefined) return; // Clicked somewhere else

            let pendingRequests = getStoredData('pendingAccountRequests', []);
            const requestIndex = parseInt(index);
            const request = pendingRequests[requestIndex];

            if (!request) return; // Should not happen

            if (target.classList.contains('approve-account-request')) {
                // Add to approved users list - store all relevant details
                let approvedUsers = getStoredData('approvedUsers', []);
                approvedUsers.push({
                    username: request.username,
                    age: request.age,
                    email: request.email,
                    password: request.password, // Store password for login check
                    role: request.role // Use the role from the pending request
                });
                setStoredData('approvedUsers', approvedUsers);

                // Remove from pending
                // Remove from pending
                pendingRequests.splice(requestIndex, 1);
                setStoredData('pendingAccountRequests', pendingRequests);

                alert(`تمت الموافقة على حساب ${request.username}`);
                // Optionally, simulate sending an approval email here
                console.log(`Simulating approval email to ${request.email} for user ${request.username}`);


            } else if (target.classList.contains('deny-account-request')) {
                // Just remove from pending
                // Just remove from pending
                pendingRequests.splice(requestIndex, 1);
                setStoredData('pendingAccountRequests', pendingRequests);
                alert(`تم رفض حساب ${request.username}`);
                 // Optionally, simulate sending a rejection email here
                 console.log(`Simulating rejection email to ${request.email} for user ${request.username}`);
            }

            // Refresh the list display
            displayPendingAccountRequests();
        });
     }

     // --- Display Pending Discussion Posts (Admin) ---
     function displayPendingDiscussionPosts() {
        const postsList = document.getElementById('pending-discussion-posts-list');
        const noPostsMsg = document.getElementById('no-pending-discussion-posts');
        const requests = getStoredData('pendingDiscussionPosts', []);

        postsList.innerHTML = ''; // Clear previous list items
        postsList.appendChild(noPostsMsg); // Keep the 'no posts' message

        if (requests.length > 0) {
            noPostsMsg.style.display = 'none';
            requests.forEach((post, index) => {
                const listItem = document.createElement('li');
                // Display post details for the admin
                listItem.innerHTML = `
                    <span>[${post.courseId || 'دورة غير معروفة'}] <strong>${post.username}:</strong> ${post.text}</span>
                    <button class="approve-discussion-post" data-index="${index}">موافقة</button>
                    <button class="deny-discussion-post" data-index="${index}">رفض</button>
                `;
                postsList.appendChild(listItem);
            });
        } else {
            noPostsMsg.style.display = 'block';
        }
     }

     // --- Admin Discussion Post Action Buttons Logic ---
     function setupAdminDiscussionActionButtons() {
        const postsList = document.getElementById('pending-discussion-posts-list');

        postsList.addEventListener('click', (event) => {
            const target = event.target;
            const index = target.dataset.index;

            if (index === undefined) return; // Clicked somewhere else

            let pendingPosts = getStoredData('pendingDiscussionPosts', []);
            const postIndex = parseInt(index);
            const post = pendingPosts[postIndex];

            if (!post) return; // Should not happen

            if (target.classList.contains('approve-discussion-post')) {
                // Add to approved posts list
                let approvedPosts = getStoredData('approvedDiscussionPosts', []);
                approvedPosts.push(post); // Add the entire post object
                setStoredData('approvedDiscussionPosts', approvedPosts);

                // Remove from pending
                pendingPosts.splice(postIndex, 1);
                setStoredData('pendingDiscussionPosts', pendingPosts);

                alert(`تمت الموافقة على المشاركة.`);
                // Note: This doesn't automatically refresh the view on the course page itself.

            } else if (target.classList.contains('deny-discussion-post')) {
                // Just remove from pending
                pendingPosts.splice(postIndex, 1);
                setStoredData('pendingDiscussionPosts', pendingPosts);
                alert(`تم رفض المشاركة.`);
            }

            // Refresh the pending list display on the admin dashboard
            displayPendingDiscussionPosts();
        });
     }

     // --- Populate Certificate User Dropdown (Admin) ---
     function populateCertificateUserDropdown() {
         const userSelect = document.getElementById('assign-certificate-user');
         if (!userSelect) return;

         const approvedUsers = getStoredData('approvedUsers', []);
         // Clear existing options except the placeholder
         userSelect.innerHTML = '<option value="">-- اختر مستخدم --</option>';

         approvedUsers.forEach(user => {
             // Add only students and instructors, maybe filter by role if needed
             // if (user.role === 'student' || user.role === 'instructor') {
                 const option = document.createElement('option');
                 option.value = user.username; // Use username as the value
                 option.textContent = `${user.username} (${user.email})`; // Display username and email
                 userSelect.appendChild(option);
             // }
         });
     }

     // --- Certificate Assignment Form Logic (Admin) ---
     function setupCertificateAssignmentForm() {
         const certForm = document.getElementById('assign-certificate-form');
         if (!certForm) return;

         certForm.addEventListener('submit', (e) => {
             e.preventDefault();
             const fileInput = document.getElementById('certificate-file');
             const userSelect = document.getElementById('assign-certificate-user');

             const selectedFile = fileInput.files[0]; // Get the selected file object
             const selectedUsername = userSelect.value;

             if (!selectedFile || !selectedUsername) {
                 alert('يرجى اختيار ملف الشهادة والمستخدم.');
                 return;
             }

             const certificateFileName = selectedFile.name; // Get the name of the file

             // Store the assignment (mapping: username -> certificate file name)
             let assignments = getStoredData('assignedCertificates', {});
             assignments[selectedUsername] = certificateFileName; // Assign/overwrite certificate file name for the user
             setStoredData('assignedCertificates', assignments);

             alert(`تم تعيين ملف الشهادة "${certificateFileName}" للمستخدم ${selectedUsername}.`);
             certForm.reset(); // Clear the form
         });
     }


     // --- Logout Logic ---
     const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent link from navigating directly
            console.log('Logout initiated');

            // Clear user data from localStorage
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');

            // Redirect to login page
            window.location.href = 'index.html';
        });
    }

    // --- Function to Load Course Data (Checks localStorage first) ---
    async function loadCourseData() {
        if (allCoursesData) return allCoursesData; // Return cached data if already loaded

        // Try loading edited data from localStorage first
        const editedData = getStoredData('editedCourseData', null);
        if (editedData) {
            console.log("Using edited course data from localStorage.");
            allCoursesData = editedData;
            return allCoursesData;
        }

        // If no edited data, fetch from JSON file
        try {
            console.log("Fetching course data from data/courses.json");
            const response = await fetch('data/courses.json'); // Relative path from HTML file
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // IMPORTANT: Store the original fetched data in localStorage as well
            // This allows resetting or comparing later if needed.
            // setStoredData('originalCourseData', data.courses); // Maybe add later if reset is needed
            allCoursesData = data.courses; // Store the array of courses
            console.log("Course data loaded successfully from JSON:", allCoursesData);
            // Also store the freshly loaded data as the 'edited' data initially
            setStoredData('editedCourseData', allCoursesData);
            return allCoursesData;
        } catch (error) {
            console.error("Could not load course data from JSON:", error);
            allCoursesData = []; // Set to empty array on error
            return allCoursesData;
        }
    }

     // --- Course Page Logic ---
     const discussionForm = document.getElementById('discussion-form'); // Assuming form has this ID
     const discussionList = document.getElementById('discussion-list'); // Assuming list has this ID

     // Function to get current course ID from body ID
     function getCurrentCourseId() {
         const bodyId = document.body.id; // e.g., "course-montage-page"
         if (bodyId && bodyId.startsWith('course-') && bodyId.endsWith('-page')) {
             return bodyId.substring(7, bodyId.length - 5); // Extract "montage"
         }
         console.warn("Could not determine course ID from body ID for discussion post.");
         return 'unknown-course';
     }

     // Function to display APPROVED discussion posts for the current course
     function displayApprovedPosts(courseId) {
         if (!discussionList) return;
         const allApprovedPosts = getStoredData('approvedDiscussionPosts', []);
         const coursePosts = allApprovedPosts.filter(post => post.courseId === courseId);

         discussionList.innerHTML = ''; // Clear existing posts

         if (coursePosts.length > 0) {
             coursePosts.forEach(post => {
                 const listItem = document.createElement('li');
                 listItem.innerHTML = `<strong>${post.username || 'مستخدم'}:</strong> ${post.text}`;
                 // Add timestamp if available: const date = new Date(post.timestamp).toLocaleString('ar-EG'); listItem.innerHTML += `<br><small>${date}</small>`;
                 discussionList.appendChild(listItem);
             });
         } else {
             discussionList.innerHTML = '<li>لا توجد مشاركات حالياً.</li>';
         }
     }


     if (discussionForm && discussionList) {
         const courseId = getCurrentCourseId();
         displayApprovedPosts(courseId); // Load approved posts on page load

         discussionForm.addEventListener('submit', (e) => {
             e.preventDefault();
             const postTextarea = document.getElementById('discussion-post'); // Assuming textarea has this ID
             const postText = postTextarea.value.trim();
             const username = localStorage.getItem('username') || 'مستخدم مجهول'; // Get logged-in username

             if (postText) {
                 // Save to pending posts instead of displaying directly
                 let pendingPosts = getStoredData('pendingDiscussionPosts', []);
                 const newPendingPost = {
                     id: Date.now(), // Simple unique ID
                     courseId: courseId, // Use dynamically determined course ID
                     username: username,
                     text: postText,
                     timestamp: new Date().toISOString()
                 };
                 pendingPosts.push(newPendingPost);
                 setStoredData('pendingDiscussionPosts', pendingPosts);

                 alert('تم إرسال مشاركتك للمراجعة من قبل المدير.');
                 postTextarea.value = ''; // Clear textarea
                 // Do NOT display the post here, wait for admin approval
             }
         });
     }

     // --- Certificate Button Logic on Course Page ---
     const downloadCertButton = document.getElementById('download-certificate-button'); // Assuming button has this ID
     if (downloadCertButton) {
         const loggedInUsername = localStorage.getItem('username');
         const assignedCertificates = getStoredData('assignedCertificates', {}); // Stores { username: "filename.pdf" }

         if (loggedInUsername && assignedCertificates[loggedInUsername]) {
             // User has a certificate file name assigned
             const certificateFileName = assignedCertificates[loggedInUsername];
             downloadCertButton.disabled = false;
             downloadCertButton.textContent = `تحميل الشهادة (${certificateFileName})`; // Show file name
             // Add actual download functionality here if needed (e.g., link to a file)
             // For simulation, we just enable the button and show an alert.
             downloadCertButton.addEventListener('click', () => {
                 alert(`محاكاة تحميل ملف الشهادة "${certificateFileName}" للمستخدم ${loggedInUsername}.`);
                 // In a real app, this would trigger a file download, likely using a server endpoint
                 // Example: window.location.href = `/download-certificate?user=${loggedInUsername}&file=${certificateFileName}`;
             });
         } else {
             // User does not have a certificate assigned
             downloadCertButton.disabled = true;
             downloadCertButton.textContent = 'تحميل الشهادة (غير متاحة بعد)';
         }
      }
      // --- End Course Page Logic ---


     // --- Lesson Page Logic ---
     async function populateLessonContent() {
        const body = document.body;
        // Expecting lesson pages to have a body id like "lesson-page-montage-lesson-1"
        // Or potentially just "lesson-montage-1" if simpler
        const bodyId = body.id || '';
        const idParts = bodyId.split('-');

        // Basic check if it looks like a lesson page ID structure
        if (bodyId.startsWith('lesson-page-') && idParts.length >= 5) {
            const courseId = idParts[2];
            const lessonId = `${idParts[3]}-${idParts[4]}`; // e.g., "lesson-1"

            console.log(`Lesson page detected. Course: ${courseId}, Lesson: ${lessonId}`);

            const courses = await loadCourseData(); // Ensure data is loaded
            if (!courses || courses.length === 0) {
                 console.error("No course data available to populate lesson.");
                 const mainContent = document.getElementById('course-main-content');
                 if(mainContent) mainContent.innerHTML = '<p style="color: red;">خطأ: لا يمكن تحميل محتوى الدرس. بيانات الكورس غير متاحة.</p>';
                 return;
            }

            const course = courses.find(c => c.id === courseId);
            if (!course) {
                console.error(`Course with ID ${courseId} not found in loaded data.`);
                 const mainContent = document.getElementById('course-main-content');
                 if(mainContent) mainContent.innerHTML = `<p style="color: red;">خطأ: الكورس بالمعرف "${courseId}" غير موجود.</p>`;
                return;
            }

            const lesson = course.lessons.find(l => l.id === lessonId);
            if (!lesson) {
                console.error(`Lesson with ID ${lessonId} not found in course ${courseId}.`);
                 const mainContent = document.getElementById('course-main-content');
                 if(mainContent) mainContent.innerHTML = `<p style="color: red;">خطأ: الدرس بالمعرف "${lessonId}" غير موجود في كورس "${course.name}".</p>`;
                return;
            }

            // --- Populate Content ---

            // Page Title
            document.title = `${lesson.title} - ${course.name} - منصة بشمهندس ميدو`;

            // Header Title (Course Name)
            const headerTitle = document.querySelector('header h1');
            if (headerTitle) {
                headerTitle.textContent = course.name;
            }

            // Lesson Title (in main content)
            const lessonTitleElement = document.querySelector('#course-main-content article.lesson h3');
            if (lessonTitleElement) {
                lessonTitleElement.textContent = lesson.title;
            } else {
                 console.warn("Lesson title element (h3) not found in main content.");
            }

            // Video Player
            const videoElement = document.querySelector('#course-main-content article.lesson video');
            if (videoElement) {
                // Clear existing sources and fallback text/link first
                const existingSource = videoElement.querySelector('source');
                const existingLink = videoElement.querySelector('a'); // Fallback link
                const existingNoSupportMsg = videoElement.querySelector('.no-support-msg'); // Assuming the text is wrapped

                if(existingSource) videoElement.removeChild(existingSource);
                if(existingLink) videoElement.removeChild(existingLink);
                if(existingNoSupportMsg) videoElement.removeChild(existingNoSupportMsg);

                 if (lesson.videoUrl && lesson.videoUrl.trim() !== '') {
                     // Create and add the new source element
                     const newSource = document.createElement('source');
                     newSource.setAttribute('src', lesson.videoUrl);
                     // Basic type detection
                     const type = lesson.videoUrl.endsWith('.mp4') ? 'video/mp4' :
                                  lesson.videoUrl.endsWith('.webm') ? 'video/webm' :
                                  lesson.videoUrl.endsWith('.ogv') ? 'video/ogg' : '';
                     if (type) {
                         newSource.setAttribute('type', type);
                     }
                     videoElement.insertBefore(newSource, videoElement.firstChild); // Add source

                     // Add fallback link and message AFTER the source
                     const noSupportPara = document.createElement('p');
                     noSupportPara.classList.add('no-support-msg'); // Add class for potential styling/hiding
                     noSupportPara.textContent = 'عذراً، متصفحك لا يدعم عرض الفيديو. ';
                     const newLink = document.createElement('a');
                     newLink.href = lesson.videoUrl;
                     newLink.textContent = `رابط بديل للفيديو (${lesson.title})`;
                     newLink.target = "_blank"; // Open in new tab
                     noSupportPara.appendChild(document.createElement('br'));
                     noSupportPara.appendChild(newLink);
                     videoElement.appendChild(noSupportPara);


                     videoElement.load(); // Reload the video element to apply the new source
                 } else {
                     console.warn(`No video URL provided for lesson ${lessonId} in course ${courseId}.`);
                     // Display a message indicating no video
                     const noVideoMsg = document.createElement('p');
                     noVideoMsg.textContent = 'لا يوجد فيديو متاح لهذا الدرس حالياً.';
                     noVideoMsg.style.padding = '20px';
                     noVideoMsg.style.textAlign = 'center';
                     videoElement.appendChild(noVideoMsg); // Append message inside video tag
                 }

            } else {
                 console.warn("Video element not found on the page.");
            }

            // Sidebar Active Link (based on lesson file name convention)
            const sidebarLinks = document.querySelectorAll('#course-sidebar ul li a');
            sidebarLinks.forEach(link => {
                // Assumes lesson files are named like lesson-1.html, lesson-2.html...
                const expectedHref = `${lessonId}.html`;
                if (link.getAttribute('href') === expectedHref) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

        } else {
             // console.log("Not a lesson page (based on body ID), skipping lesson content population.");
        }
     }
     // --- End Lesson Page Logic ---


    // --- Admin: Course Content Editor Logic ---
    async function populateCourseEditorDropdown() {
        const selectElement = document.getElementById('edit-course-select');
        if (!selectElement) {
            console.warn("Course editor dropdown not found.");
            return;
        }

        const courses = await loadCourseData(); // Load data (checks localStorage first)
        if (!courses || courses.length === 0) {
            selectElement.innerHTML = '<option value="">-- لا يمكن تحميل الكورسات --</option>';
            return;
        }

        // Clear existing options except the placeholder
        selectElement.innerHTML = '<option value="">-- اختر كورس --</option>';

        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            selectElement.appendChild(option);
        });
        console.log("Course editor dropdown populated.");
    }

    function displayLessonEditors(courseId) {
        const container = document.getElementById('lesson-editors-container');
        const prompt = document.getElementById('select-course-prompt');
        if (!container) {
             console.error("Lesson editors container not found.");
             return;
        }
        if (prompt) prompt.style.display = 'none'; // Hide prompt if it exists

        container.innerHTML = ''; // Clear previous editors or prompt

        const course = allCoursesData.find(c => c.id === courseId);
        if (!course || !course.lessons || course.lessons.length === 0) {
            container.innerHTML = '<p>لا توجد دروس معرفة لهذا الكورس أو لم يتم تحميل بيانات الكورس بعد.</p>';
            return;
        }

        console.log(`Displaying editors for course: ${courseId}`);
        course.lessons.forEach((lesson, index) => {
            const editorDiv = document.createElement('div');
            editorDiv.classList.add('lesson-editor');
            editorDiv.dataset.lessonId = lesson.id; // Store lesson ID
            editorDiv.style.marginBottom = '15px';
            editorDiv.style.padding = '10px';
            editorDiv.style.border = '1px solid #ddd';
            editorDiv.style.borderRadius = '4px';

            const lessonIndex = index + 1; // For display (1-based index)

            // Lesson Title Input
            const titleLabel = document.createElement('label');
            titleLabel.htmlFor = `lesson-editor-${courseId}-${lesson.id}-title`;
            titleLabel.textContent = `اسم الدرس ${lessonIndex}:`;
            titleLabel.style.display = 'block';
            titleLabel.style.marginBottom = '3px';
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.id = titleLabel.htmlFor;
            titleInput.value = lesson.title || '';
            titleInput.style.width = 'calc(100% - 22px)';
            titleInput.style.marginBottom = '8px';
            titleInput.style.padding = '8px';
            titleInput.style.border = '1px solid #ccc';

            // Video URL Input
            const urlLabel = document.createElement('label');
            urlLabel.htmlFor = `lesson-editor-${courseId}-${lesson.id}-url`;
            urlLabel.textContent = `رابط فيديو الدرس ${lessonIndex}:`;
            urlLabel.style.display = 'block';
            urlLabel.style.marginBottom = '3px';
            const urlInput = document.createElement('input');
            urlInput.type = 'url'; // Use URL type for basic validation
            urlInput.id = urlLabel.htmlFor;
            urlInput.value = lesson.videoUrl || '';
            urlInput.placeholder = 'مثال: videos/course/lesson.mp4 أو https://...';
            urlInput.style.width = 'calc(100% - 22px)';
            urlInput.style.marginBottom = '8px';
            urlInput.style.padding = '8px';
            urlInput.style.border = '1px solid #ccc';
            urlInput.style.direction = 'ltr'; // Ensure URL input is LTR

            // Save Button
            const saveButton = document.createElement('button');
            saveButton.textContent = `حفظ تغييرات الدرس ${lessonIndex}`;
            saveButton.classList.add('save-lesson-btn');
            saveButton.dataset.courseId = courseId; // Link button to course
            saveButton.dataset.lessonId = lesson.id; // Link button to lesson
            saveButton.style.marginTop = '5px';
            saveButton.style.padding = '8px 12px';
            saveButton.style.cursor = 'pointer';

            editorDiv.appendChild(titleLabel);
            editorDiv.appendChild(titleInput);
            editorDiv.appendChild(document.createElement('br'));
            editorDiv.appendChild(urlLabel);
            editorDiv.appendChild(urlInput);
            editorDiv.appendChild(document.createElement('br'));
            editorDiv.appendChild(saveButton);

            container.appendChild(editorDiv);
        });
    }

    function saveLessonChanges(courseId, lessonId) {
        if (!allCoursesData) {
            console.error("Course data not loaded, cannot save.");
            alert("خطأ: بيانات الكورس غير محملة، لا يمكن الحفظ.");
            return;
        }

        const courseIndex = allCoursesData.findIndex(c => c.id === courseId);
        if (courseIndex === -1) {
            console.error(`Course ${courseId} not found in data.`);
            alert(`خطأ: لم يتم العثور على الكورس ${courseId}.`);
            return;
        }

        const lessonIndex = allCoursesData[courseIndex].lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex === -1) {
            console.error(`Lesson ${lessonId} not found in course ${courseId}.`);
             alert(`خطأ: لم يتم العثور على الدرس ${lessonId}.`);
            return;
        }

        // Find the input fields for this specific lesson
        const titleInput = document.getElementById(`lesson-editor-${courseId}-${lessonId}-title`);
        const urlInput = document.getElementById(`lesson-editor-${courseId}-${lessonId}-url`);

        if (!titleInput || !urlInput) {
            console.error(`Input fields for lesson ${lessonId} not found.`);
            alert(`خطأ: لم يتم العثور على حقول الإدخال للدرس ${lessonId}.`);
            return;
        }

        const newTitle = titleInput.value.trim();
        const newUrl = urlInput.value.trim();

        // Update the data in the global variable (make a deep copy to avoid modifying the original object directly if needed elsewhere)
        // For simplicity here, we modify directly. If issues arise, consider deep copying.
        allCoursesData[courseIndex].lessons[lessonIndex].title = newTitle;
        allCoursesData[courseIndex].lessons[lessonIndex].videoUrl = newUrl;

        // Save the entire updated course data structure to localStorage
        setStoredData('editedCourseData', allCoursesData);

        // Provide feedback
        const statusMsg = document.getElementById('course-editor-status');
        if (statusMsg) {
            statusMsg.textContent = `تم حفظ التغييرات للدرس "${newTitle}" في كورس "${allCoursesData[courseIndex].name}" مؤقتًا.`;
            statusMsg.style.color = 'green';
            statusMsg.style.display = 'block';
            setTimeout(() => { statusMsg.style.display = 'none'; }, 4000); // Hide after 4 seconds
        }
        console.log(`Saved changes for ${courseId} - ${lessonId}: Title=${newTitle}, URL=${newUrl}`);
        // Optionally, reload lesson content if the user is currently on that lesson page (might be complex)
    }

    function setupCourseEditorListeners() {
        const selectElement = document.getElementById('edit-course-select');
        const editorsContainer = document.getElementById('lesson-editors-container');

        if (selectElement) {
            selectElement.addEventListener('change', (event) => {
                const selectedCourseId = event.target.value;
                if (selectedCourseId) {
                    displayLessonEditors(selectedCourseId);
                } else {
                    // Clear editors if default option is selected
                    const prompt = document.getElementById('select-course-prompt');
                    if (editorsContainer) editorsContainer.innerHTML = ''; // Clear container
                    if(prompt) {
                         if (editorsContainer) editorsContainer.appendChild(prompt);
                        prompt.style.display = 'block'; // Show prompt again
                    }
                }
            });
        } else {
             console.warn("Course editor select element not found.");
        }

        // Use event delegation for save buttons since they are added dynamically
        if (editorsContainer) {
            editorsContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('save-lesson-btn')) {
                    const button = event.target;
                    const courseId = button.dataset.courseId;
                    const lessonId = button.dataset.lessonId;
                    if (courseId && lessonId) {
                        saveLessonChanges(courseId, lessonId);
                    } else {
                        console.error("Save button missing course or lesson ID.");
                        alert("خطأ: زر الحفظ لا يحتوي على معرف الكورس أو الدرس.");
                    }
                }
            });
        } else {
             console.warn("Lesson editors container not found for event delegation.");
        }
         console.log("Course editor listeners set up.");
    }
    // --- End Admin: Course Content Editor Logic ---


     // --- Admin: Populate User Dropdown for Enrollment Management ---
     function populateEnrollmentUserDropdown() {
         const userSelect = document.getElementById('manage-enrollment-user');
         if (!userSelect) return;

         const approvedUsers = getStoredData('approvedUsers', []);
         // Clear existing options except the placeholder
         userSelect.innerHTML = '<option value="">-- اختر مستخدم --</option>';

         approvedUsers.forEach(user => {
             const option = document.createElement('option');
             option.value = user.username; // Use username as the value
             option.textContent = `${user.username} (${user.role} - ${user.email})`; // Display username, role and email
             userSelect.appendChild(option);
         });
     }

     // --- Admin: Setup Listeners for Enrollment Management Section ---
     function setupEnrollmentManagement() {
         const userSelect = document.getElementById('manage-enrollment-user');
         const currentCoursesDiv = document.getElementById('user-current-courses');
         const addCourseDiv = document.getElementById('add-course-to-user');
         const currentCoursesList = document.getElementById('current-courses-list');
         const addCourseButton = document.getElementById('add-course-button');

         if (!userSelect || !currentCoursesDiv || !addCourseDiv || !currentCoursesList || !addCourseButton) {
             console.error("Enrollment management elements not found.");
             return;
         }

         // Listener for user selection change
         userSelect.addEventListener('change', () => {
             const selectedUsername = userSelect.value;
             if (selectedUsername) {
                 displayUserCurrentCourses(selectedUsername);
                 populateAddCourseDropdown(selectedUsername);
                 currentCoursesDiv.style.display = 'block';
                 addCourseDiv.style.display = 'block';
             } else {
                 // Hide sections if no user is selected
                 currentCoursesDiv.style.display = 'none';
                 addCourseDiv.style.display = 'none';
             }
         });

         // Listener for removing a course (using event delegation)
         currentCoursesList.addEventListener('click', (event) => {
             if (event.target.classList.contains('remove-course-from-user')) {
                 const selectedUsername = userSelect.value;
                 const courseIdToRemove = event.target.dataset.courseId;
                 if (selectedUsername && courseIdToRemove) {
                     removeCourseFromUser(selectedUsername, courseIdToRemove);
                 }
             }
         });

         // Listener for adding a course
         addCourseButton.addEventListener('click', () => {
             const selectedUsername = userSelect.value;
             const addCourseSelect = document.getElementById('add-course-select');
             const courseIdToAdd = addCourseSelect.value;
             const selectedOption = addCourseSelect.options[addCourseSelect.selectedIndex];
             const courseNameToAdd = selectedOption ? selectedOption.text : ''; // Get course name from selected option text

             if (selectedUsername && courseIdToAdd && courseNameToAdd) {
                 addCourseToUser(selectedUsername, courseIdToAdd, courseNameToAdd);
             } else if (!courseIdToAdd) {
                 alert("يرجى اختيار كورس لإضافته.");
             }
         });
     }

     // --- Admin: Display Selected User's Current Courses ---
     function displayUserCurrentCourses(username) {
         const currentCoursesList = document.getElementById('current-courses-list');
         const noCoursesMsg = document.getElementById('no-current-courses');
         if (!currentCoursesList || !noCoursesMsg) return;

         const allEnrollments = getStoredData('approvedEnrollments', {});
         const userCourses = allEnrollments[username] || [];

         // Clear previous list items (keep the 'no courses' message)
         currentCoursesList.innerHTML = '';
         currentCoursesList.appendChild(noCoursesMsg);

         if (userCourses.length > 0) {
             noCoursesMsg.style.display = 'none';
             userCourses.forEach(course => {
                 const listItem = document.createElement('li');
                 listItem.innerHTML = `
                     <span>${course.courseName || course.courseId}</span>
                     <button class="remove-course-from-user" data-course-id="${course.courseId}" style="margin-right: 10px; background-color: #dc3545; border-color: #dc3545;">إزالة</button>
                 `;
                 currentCoursesList.appendChild(listItem);
             });
         } else {
             noCoursesMsg.style.display = 'block';
         }
     }

     // --- Admin: Populate Add Course Dropdown (excluding already enrolled) ---
     function populateAddCourseDropdown(username) {
         const addCourseSelect = document.getElementById('add-course-select');
         if (!addCourseSelect) return;

         // Define available courses (could be fetched dynamically in a real app)
         const availableCourses = [
             { id: 'ai-whiteboard', name: 'كورس وايت بورد وذكاء اصطناعي' },
             { id: 'misc-videos', name: 'كورس فيديوهات متنوعة' },
             { id: 'montage', name: 'كورس مونتاج' },
             { id: 'photoshop', name: 'كورس فوتوشوب' },
             { id: 'advertising', name: 'كورس اعلانات' },
             { id: 'canva', name: 'كورس كانفا' },
             { id: 'motion-graphics', name: 'كورس موشن جرافيك' }
         ];

         const allEnrollments = getStoredData('approvedEnrollments', {});
         const userEnrolledCourseIds = (allEnrollments[username] || []).map(c => c.courseId);

         // Filter courses the user is NOT enrolled in
         const coursesToAdd = availableCourses.filter(course => !userEnrolledCourseIds.includes(course.id));

         // Clear existing options except the placeholder
         addCourseSelect.innerHTML = '<option value="">-- اختر كورس --</option>';

         if (coursesToAdd.length > 0) {
             coursesToAdd.forEach(course => {
                 const option = document.createElement('option');
                 option.value = course.id;
                 option.textContent = course.name;
                 addCourseSelect.appendChild(option);
             });
             addCourseSelect.disabled = false;
             document.getElementById('add-course-button').disabled = false;
         } else {
             // If user is enrolled in all available courses
             addCourseSelect.innerHTML = '<option value="">-- لا توجد كورسات أخرى متاحة --</option>';
             addCourseSelect.disabled = true;
             document.getElementById('add-course-button').disabled = true;
         }
     }

     // --- Admin: Remove Course from User Logic ---
     function removeCourseFromUser(username, courseIdToRemove) {
         let allEnrollments = getStoredData('approvedEnrollments', {});
         if (allEnrollments[username]) {
             // Filter out the course to remove
             allEnrollments[username] = allEnrollments[username].filter(course => course.courseId !== courseIdToRemove);
             // If user has no courses left, remove the user entry? Optional.
             // if (allEnrollments[username].length === 0) {
             //     delete allEnrollments[username];
             // }
             setStoredData('approvedEnrollments', allEnrollments);

             // Refresh display
             displayUserCurrentCourses(username);
             populateAddCourseDropdown(username); // Refresh add dropdown as well
             alert(`تمت إزالة الكورس ${courseIdToRemove} من المستخدم ${username}.`);
         } else {
             alert(`خطأ: لم يتم العثور على تسجيلات للمستخدم ${username}.`);
         }
     }

     // --- Admin: Add Course to User Logic ---
     function addCourseToUser(username, courseIdToAdd, courseNameToAdd) {
         let allEnrollments = getStoredData('approvedEnrollments', {});

         // Initialize array for the user if it doesn't exist
         if (!allEnrollments[username]) {
             allEnrollments[username] = [];
         }

         // Check if course is already added (shouldn't happen if dropdown is correct, but good practice)
         if (!allEnrollments[username].some(c => c.courseId === courseIdToAdd)) {
             allEnrollments[username].push({ courseId: courseIdToAdd, courseName: courseNameToAdd });
             setStoredData('approvedEnrollments', allEnrollments);

             // Refresh display
             displayUserCurrentCourses(username);
             populateAddCourseDropdown(username); // Refresh add dropdown

             // Show feedback message
             const statusMsg = document.getElementById('add-course-status');
             if(statusMsg) {
                 statusMsg.textContent = `تمت إضافة "${courseNameToAdd}" للمستخدم ${username}.`;
                 statusMsg.style.display = 'block';
                 // Hide message after a few seconds
                 setTimeout(() => { statusMsg.style.display = 'none'; }, 3000);
             }

         } else {
             alert(`المستخدم ${username} مسجل بالفعل في هذا الكورس.`);
         }
     }

     // --- Course Page: Lesson Navigation Logic ---
     const courseSidebar = document.getElementById('course-sidebar');
     const courseMainContent = document.getElementById('course-main-content');

     if (courseSidebar && courseMainContent) {
         const lessonLinks = courseSidebar.querySelectorAll('ul li a[href^="#lesson-"]'); // Select only links pointing to lessons
         const allContentSections = courseMainContent.querySelectorAll('#course-description, #assignments, #discussion, #certificate, .lesson');
         const courseDescriptionSection = document.getElementById('course-description'); // Get description section specifically

         // Function to show a specific section and hide others
         const showSection = (targetId) => {
             allContentSections.forEach(section => {
                 if (section.id === targetId) {
                     // Use the 'active-lesson' class for lessons, 'display: block' for others might be needed if they don't use the class
                     if (section.classList.contains('lesson')) {
                         section.classList.add('active-lesson'); // Use CSS class for animation
                         section.style.display = 'block'; // Ensure it's visible
                     } else {
                         section.style.display = 'block'; // Show non-lesson sections directly
                     }
                 } else {
                     if (section.classList.contains('lesson')) {
                         section.classList.remove('active-lesson');
                         section.style.display = 'none'; // Hide inactive lessons
                     } else {
                         section.style.display = 'none'; // Hide non-lesson sections
                     }
                 }
             });
         };

         // Initial setup: Hide all lessons, show description
         allContentSections.forEach(section => {
             if (section.id === 'course-description') {
                 section.style.display = 'block'; // Show description
             } else {
                 section.style.display = 'none'; // Hide others
                 if(section.classList.contains('lesson')) {
                     section.classList.remove('active-lesson'); // Ensure class is removed
                 }
             }
         });
         // Optional: Set the "Course Description" link as active initially if it exists
         const descriptionLink = courseSidebar.querySelector('ul li a[href="#course-description"]');
         if (descriptionLink) {
             descriptionLink.classList.add('active');
         }


         // Add click listeners to lesson links
         lessonLinks.forEach(link => {
             link.addEventListener('click', (event) => {
                 event.preventDefault(); // Prevent default anchor jump

                 // Get target lesson ID (e.g., "lesson-1" from "#lesson-1")
                 const targetLessonId = link.getAttribute('href').substring(1);

                 // Update active link in sidebar
                 lessonLinks.forEach(l => l.classList.remove('active'));
                 // Also remove active from non-lesson links like description if they exist
                 const otherLinks = courseSidebar.querySelectorAll('ul li a:not([href^="#lesson-"])');
                 otherLinks.forEach(l => l.classList.remove('active'));
                 link.classList.add('active');

                 // Show the target lesson section
                 showSection(targetLessonId);
             });
         });

         // Add listeners for non-lesson links (like description, assignments) if they exist
         const nonLessonLinks = courseSidebar.querySelectorAll('ul li a:not([href^="#lesson-"])');
         nonLessonLinks.forEach(link => {
             link.addEventListener('click', (event) => {
                 event.preventDefault();
                 const targetSectionId = link.getAttribute('href').substring(1); // e.g., "course-description"

                 // Update active link
                 lessonLinks.forEach(l => l.classList.remove('active'));
                 nonLessonLinks.forEach(l => l.classList.remove('active'));
                 link.classList.add('active');

                 // Show the target section
                 showSection(targetSectionId);
             });
         });
     }
     // --- End Course Page: Lesson Navigation Logic ---


 });

 // --- Utility Functions (Add as needed) ---
 // Example: function loadCourses() { ... }


    // --- Initial Load and Setup ---
    // Try to load lesson content if applicable (awaits inside)
    populateLessonContent();
