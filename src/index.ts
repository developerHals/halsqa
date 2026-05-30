export default {
  async fetch(request, env) {
    // This is where we handle incoming requests
    // env.esol_marking_db gives us access to your D1 database
    
    return new Response("Hello ESOLQA! The worker is live.");
  },
};
