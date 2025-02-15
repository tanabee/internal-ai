# Installation Guide 

## Prerequisites

- Node.js v20+
- [pnpm](https://github.com/pnpm/pnpm)
- [firebase-tools](https://github.com/firebase/firebase-tools)

## Steps

1. Create Firebase project
2. Clone and Modify the source code
3. Configure Google Cloud
4. Deploy the project to Firebase
5. Configure Blocking Function
6. Sign up for internal AI

### 1. Create Firebase project

First, Access [here](https://console.firebase.google.com) and create a Firebase project. 

Once the creation is completed, proceed with the following configurations.

- Upgrade the Firebase project to Blaze plan
- Enable Firestore Database
- Enable Firebase Authentication
  - Enable the following Sign-in methods
    - Email/Password (Email link)
    - Google
- Add web app
  - Select `gear icon` > `Project settings` > `General` > Create web app in `Your apps` section. The values of firebaseConfig displayed will be used in subsequent steps, so please keep the window open.

### 2. Clone and Modify the source code

First, [Fork internal-ai project](https://github.com/tanabee/internal-ai/fork) to your organization.

Run the following commands.

Clone project to your local PC.

```sh
git clone git@github.com:[replace this with your GitHub organization]/internal-ai.git
```

Install packages using pnpm.

```sh
pnpm i -r
``` 

Modify the source code for your project.

```sh
export FIREBASE_PROJECT_ID="your-firebase-project-id" # Replace this with actual value
grep -l "internal-ai-demo" ./**/*.ts .firebaserc -r | xargs sed -i '' "s/internal-ai-demo/${FIREBASE_PROJECT_ID}/g"
```

Update the values in [hosting/src/lib/firebase.ts](https://github.com/tanabee/internal-ai/blob/main/hosting/src/lib/firebase.ts#L6-L14) with the `firebaseConfig` values created in Step 1.

Modify the validation part of [functions/src/auth/beforeUserCreated.ts](https://github.com/tanabee/internal-ai/blob/main/functions/src/auth/beforeUserCreated.ts#L11-L15) to suit your organization. If you want to restrict the email domain to @company.com, change it as follows:

```typescript
-   const domain = '@tanabee.dev'
+   const domain = '@company.com'
```

### 3. Configure Google Cloud

Enable the following Google Cloud Platform features. When enabling them, make sure that the Firebase project you created is selected.

* [Extension API](https://console.developers.google.com/apis/api/firebaseextensions.googleapis.com/overview)
* [Vertex AI API](https://console.cloud.google.com/marketplace/product/google/aiplatform.googleapis.com)

Access [the IAM menu in Google Cloud Platform](https://console.cloud.google.com/iam-admin/iam) and grant the following permissions to `[GCP project number]-compute@developer.gserviceaccount.com`.

- Cloud Build Service Account
- Cloud Datastore User
- Cloud Trace Agent
- Logs Writer
- Monitoring Metric Writer
- Service Usage Consumer
- Vertex AI User

### 4. Deploy the project to Firebase

```sh
firebase login # If you are not logged in yet.
firebase deploy
```

### 5. Configure Blocking Function

Select `Authentication` > `Settings` > `Blocking functins` in the Firebase console. If enabling Identity Platform is required, follow the instructions to proceed with the activation steps.

Set the `beforeusercreated` function as the `Before account creation` item and save it. 

### 6. Sign up for internal AI.

Access https://[your firebase project id].web.app and sign up. Share the URL with your colleagues.
