import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface BoxScore {
  github_commits: number;
  github_prs: number;
  slack_messages_sent: number;
  slack_response_time: number;
  meetings_attended: number;
  total_score: number;
}

export default function Dashboard() {
  const { session } = useContext(AuthContext);
  const [score, setScore] = useState<BoxScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('box_scores')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date_range', { ascending: false })
        .limit(1)
        .single();
      setScore(data as BoxScore | null);
      setLoading(false);
    };
    load();
  }, [session]);

  if (!session) return null;
  if (loading) return null;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Hello {session.user.email}</h1>
      {score ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <MetricCard label="Total Score" value={score.total_score} highlight />
          <MetricCard label="Commits" value={score.github_commits} />
          <MetricCard label="PRs" value={score.github_prs} />
          <MetricCard
            label="Slack Messages"
            value={score.slack_messages_sent}
          />
          <MetricCard
            label="Response Time"
            value={score.slack_response_time.toFixed(1)}
          />
          <MetricCard label="Meetings" value={score.meetings_attended} />
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p>No score yet.</p>
          <ConnectTools />
        </div>
      )}
      {import.meta.env.DEV && (
        <div className="pt-4">
          <button
            onClick={seedSampleData}
            className="glass px-4 py-2 text-sm hover:bg-white/20"
          >
            Generate Sample Scores
          </button>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`glass p-4 text-center ${highlight ? 'col-span-full text-lg font-semibold bg-white/20' : ''}`}
    >
      <div className="mb-1">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function ConnectTools() {
  const handleClick = () => alert('OAuth coming soon');
  return (
    <div className="space-y-2">
      <button onClick={handleClick} className="glass p-2 w-full">
        Connect Slack
      </button>
      <button onClick={handleClick} className="glass p-2 w-full">
        Connect GitHub
      </button>
      <button onClick={handleClick} className="glass p-2 w-full">
        Connect Google Calendar
      </button>
    </div>
  );
}

async function seedSampleData() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return;
  const uid = session.session.user.id;
  const today = new Date();
  const monday = new Date(today.setDate(today.getDate() - today.getDay()));
  const samples = Array.from({ length: 3 }).map((_, i) => {
    const date = new Date(monday);
    date.setDate(date.getDate() - i * 7);
    return {
      user_id: uid,
      date_range: date.toISOString().split('T')[0],
      github_commits: Math.floor(Math.random() * 20),
      github_prs: Math.floor(Math.random() * 5),
      slack_messages_sent: Math.floor(Math.random() * 200),
      slack_response_time: Number((Math.random() * 5).toFixed(1)),
      meetings_attended: Math.floor(Math.random() * 10),
      total_score: Math.floor(Math.random() * 100),
    };
  });
  await supabase.from('box_scores').insert(samples);
  location.reload();
}
