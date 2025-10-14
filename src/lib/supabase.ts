import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Types for better TypeScript support
// export type Database = {
//   public: {
//     Tables: {
//       // Add your table types here as you create them
//       movies?: {
//         Row: {
//           id: string
//           title: string
//           description?: string
//           release_date?: string
//           created_at: string
//           user_id: string
//         }
//         Insert: {
//           id?: string
//           title: string
//           description?: string
//           release_date?: string
//           created_at?: string
//           user_id: string
//         }
//         Update: {
//           id?: string
//           title?: string
//           description?: string
//           release_date?: string
//           created_at?: string
//           user_id?: string
//         }
//       }
//     }
//   }
// }