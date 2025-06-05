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

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      const { data } = await supabase
        .from('box_scores')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date_range', { ascending: false })
        .limit(1)
        .single();
      setScore(data as BoxScore | null);
    };
    load();
  }, [session]);

  if (!session) return null;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Hello {session.user.email}</h1>
      {score ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
      className={`p-4 border rounded ${highlight ? 'bg-blue-100 font-bold text-center col-span-full' : ''}`}
    >
      <div>{label}</div>
      <div className="text-2xl">{value}</div>
    </div>
  );
}

function ConnectTools() {
  const handleClick = () => alert('OAuth coming soon');
  return (
    <div className="space-y-2">
      <button onClick={handleClick} className="p-2 bg-gray-200 w-full">
        Connect Slack
      </button>
      <button onClick={handleClick} className="p-2 bg-gray-200 w-full">
        Connect GitHub
      </button>
      <button onClick={handleClick} className="p-2 bg-gray-200 w-full">
        Connect Google Calendar
      </button>
    </div>
  );
}
